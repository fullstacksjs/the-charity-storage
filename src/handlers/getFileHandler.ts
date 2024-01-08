import { createHash } from 'crypto';
import type { H3Event } from 'h3';
import { createError, getQuery, setHeader, setResponseHeader } from 'h3';
import sharp from 'sharp';
import z from 'zod';

import { getKey, getParam, s3 } from '../s3';

function getHash(items: (Buffer | number | string)[]): string {
  const hash = createHash('sha256');

  items.forEach((item) => {
    if (typeof item === 'number') hash.update(item.toString());
    else hash.update(item);
  });

  return hash.digest('base64').replace(/\//g, '-');
}

interface Query {
  w: string;
  h: string;
  q: string;
}

type Transformer = (options?: { quality: number }) => void;

export const querySchema = z.object({
  w: z.coerce.number().int().min(0).max(8192).optional(),
  h: z.coerce.number().int().min(0).max(8192).optional(),
  q: z.coerce.number().int().min(0).max(100).default(100),
});

export async function getFileHandler(event: H3Event) {
  const key = getKey(event.path);
  if (!key)
    throw createError({ status: 400, statusMessage: 'No key provided' });

  const headObject = await s3.headObject(getParam(key)).catch((e) => {
    console.error(e);
    return undefined;
  });

  if (!headObject) throw createError({ status: 404, message: 'Not found' });
  if (!headObject.ContentType)
    throw createError({ status: 500, message: 'No Content-Type' });
  if (!headObject.Metadata)
    throw createError({ status: 403, message: 'Forbidden' });

  const query = getQuery<Query>(event);
  const shouldTransform = query.w || query.h || query.q;

  if (shouldTransform) {
    const { w: width, h: height, q: quality } = querySchema.parse(query);

    const contentType = headObject.ContentType;
    const object = await s3.getObject(getParam(key));
    if (!object.Body) throw createError({ status: 404, message: 'Not found' });

    const transformer = sharp(await object.Body.transformToByteArray());
    transformer.resize({ width, height });

    const transformerMap: Record<string, Transformer> = {
      'image/webp': transformer.webp.bind(transformer),
      'image/png': transformer.png.bind(transformer),
      'image/jpeg': transformer.jpeg.bind(transformer),
    };

    transformerMap[contentType]?.({ quality });

    const optimizedBuffer = await transformer.toBuffer();

    setResponseHeader(event, 'Content-Type', headObject.ContentType);
    setResponseHeader(event, 'Content-Disposition', 'inline;');
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31557600');
    setResponseHeader(event, 'ETag', `"${getHash([optimizedBuffer])}"`);
    return optimizedBuffer;
  } else {
    const request = await s3.getObject(getParam(key));

    if (!request.Body) throw createError({ status: 404 });

    setHeader(event, 'Content-Type', headObject.ContentType);
    setHeader(event, 'Content-Disposition', 'inline;');
    if (headObject.ContentLength)
      setHeader(event, 'Content-Length', headObject.ContentLength);
    if (headObject.LastModified)
      setHeader(event, 'Last-Modified', headObject.LastModified.toUTCString());
    if (headObject.ETag) setHeader(event, 'ETag', headObject.ETag);
    setHeader(event, 'Cache-Control', 'public, max-age=31557600');

    return request.Body.transformToByteArray();
  }
}

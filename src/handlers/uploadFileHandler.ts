import type { H3Event } from 'h3';
import { createError, readMultipartFormData } from 'h3';
import path from 'path';
import { Readable } from 'stream';

import { getKey, S3Client } from '../s3';

export async function uploadFileHandler(event: H3Event) {
  const key = getKey(event.path);

  if (key.endsWith('/'))
    return createError({ status: 400, message: "Can't upload directory" });

  const multipart = await readMultipartFormData(event);
  const resource = multipart?.find((data) => data.name === 'file');
  const ext = resource?.filename
    ? path.parse(resource.filename).ext.slice(1)
    : '';

  if (ext === '')
    throw createError({ status: 400, message: 'Missing Extension' });
  if (!resource) throw createError('No Resource');

  try {
    const data = await S3Client.upload({
      ext,
      Body: Readable.from(resource.data),
      ContentType: resource.type,
    }).done();
    console.log(resource.filename, { ext }, data);

    return { status: 201, ...data };
  } catch (err) {
    console.error(err);
    return createError({
      status: 500,
      statusMessage: 'Something went wrong',
    });
  }
}

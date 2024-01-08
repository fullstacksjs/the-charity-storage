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
  const ext = resource?.filename ? path.parse(resource.filename).ext : '';

  if (!resource) throw createError('No Resource');

  try {
    const data = await S3Client.upload({
      ext,
      Body: Readable.from(resource.data),
      ContentType: resource.type,
    }).done();
    return { status: 201, ...data };
  } catch (err) {
    console.error(err);
    return createError({
      status: 500,
      statusMessage: 'Something went wrong',
    });
  }
}

// if (!isNew) {
//   const { action } = await fileMetadataUpdate.validateAsync(req.body);

//   if (action === 'revoke-token') {
//     if (!hasPermission([], context)) {
//       return res.boom.forbidden('incorrect x-access-token');
//     }

//     const key = getKey(req);
//     const oldHeadObject = await getHeadObject(req, true);

//     const updatedToken = uuidv4();

//     // As S3 objects are immutable, we need to replace the entire object by its copy
//     const params = {
//       Bucket: STORAGE.S3_BUCKET,
//       Key: key,
//       CopySource: `${STORAGE.S3_BUCKET}/${key}`,
//       ContentType: oldHeadObject?.ContentType,
//       Metadata: {
//         ...oldHeadObject?.Metadata,
//         token: updatedToken,
//       },
//       MetadataDirective: 'REPLACE',
//     };

//     try {
//       await s3.copyObject(params).promise();
//     } catch (err) {
//       console.error('error updating metadata');
//       console.error(err);
//       return res.boom.badImplementation(
//         'Impossible to update the object metadata.',
//       );
//     }
//   } else {
//     return res.boom.notImplemented('Unknown metadata update');
//   }
// }

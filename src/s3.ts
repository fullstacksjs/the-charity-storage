import { S3 } from '@aws-sdk/client-s3';

import { config } from './config';

const { accessKeyId, endpoint, forcePathStyle, region, secretAccessKey } =
  config.get('s3');

export const s3 = new S3({
  forcePathStyle,
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const getKey = (path: string) => path.split('?')[0]!.substring(1);
export const getParam = (key: string) => ({
  Key: key,
  Bucket: config.get('s3.bucket'),
});

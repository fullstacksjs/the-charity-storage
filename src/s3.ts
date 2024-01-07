import AWS from 'aws-sdk';

import { config } from './config';

export const s3 = new AWS.S3(config.get('s3'));

export const getKey = (path: string) => path.substring(1);
export const getParam = (key: string) => ({
  Key: key,
  Bucket: config.get('s3.bucket'),
});

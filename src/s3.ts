import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { config } from './config';

const { accessKeyId, endpoint, forcePathStyle, region, secretAccessKey } =
  config.get('s3');

const Bucket = config.get('s3.bucket');

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
export const getParam = (key: string) => ({ Key: key, Bucket });

export const S3Client = {
  getKey,
  listObjects(key: string) {
    return s3.listObjectsV2({ Prefix: key.slice(0, -1), Bucket });
  },

  getObject(key: string) {
    return s3.getObject(getParam(key));
  },

  headObject(key: string) {
    return s3.headObject(getParam(key));
  },

  upload(args: {
    ext: string;
    Body: ConstructorParameters<typeof Upload>[0]['params']['Body'];
    ContentType?: string;
  }) {
    return new Upload({
      client: s3,
      params: {
        Bucket,
        Key: `${Date.now().toString()}.${args.ext}`,
        Body: args.Body,
        ContentType: args.ContentType,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });
  },
};

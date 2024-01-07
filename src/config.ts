import { Config } from '@fullstacksjs/config';

export const config = new Config({
  server: Config.object({
    port: Config.number({ coerce: true }).required(),
    host: Config.string({ default: 'localhost' }),
  }),
  s3: Config.object({
    accessKeyId: Config.string().required(),
    secretAccessKey: Config.string().required(),
    endpoint: Config.string(),
    forcePathStyle: Config.boolean({ default: true }),
    bucket: Config.string().required(),
    region: Config.string().required(),
  }),
});

config.parse({
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE || undefined,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
  },
});

import { Config } from '@fullstacksjs/config';

export const config = new Config({
  server: Config.object({
    port: Config.number({ coerce: true }).required(),
    host: Config.string({ default: 'localhost' }),
  }),
  s3: Config.object({
    accessKeyId: Config.string().required(),
    secretAccessKey: Config.string().required(),
    endpoint: Config.string().required(),
    sslEnabled: Config.boolean({ default: true }),
    forcePathStyle: Config.boolean({ default: true }),
    signatureVersion: Config.string({ default: 'v4' }),
    bucket: Config.string().required(),
  }),
});

export function parseConfig() {
  config.parse({
    server: {
      port: process.env.PORT,
      host: process.env.HOST,
    },
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
      sslEnabled: process.env.S3_SSL_ENABLED,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE,
      signatureVersion: process.env.S3_SIGNATURE_VERSION,
      bucket: process.env.S3_BUCKET,
    },
  });
}

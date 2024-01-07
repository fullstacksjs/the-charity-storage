declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      HOST?: string;
      S3_ACCESS_KEY_ID?: string;
      S3_SECRET_ACCESS_KEY?: string;
      S3_ENDPOINT?: string;
      S3_FORCE_PATH_STYLE?: string;
      S3_BUCKET?: string;
      S3_REGION?: string;
    }
  }
}

export {};

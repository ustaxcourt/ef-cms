import { S3 } from '@aws-sdk/client-s3';

let s3ClientCache: S3;

export const getS3 = ({
  environment,
}: {
  environment: { name: string; region: string };
}): S3 => {
  if (!s3ClientCache) {
    s3ClientCache = new S3({
      region: environment.region,
    });
  }
  return s3ClientCache;
};

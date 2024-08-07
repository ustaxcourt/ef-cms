import { type Bucket, type S3 } from '@aws-sdk/client-s3';

export const getS3Buckets = async ({
  environment,
  s3,
}: {
  environment: { name: string; region: string };
  s3: S3;
}): Promise<Bucket[]> => {
  const { Buckets } = await s3.listBuckets({});
  if (!Buckets || Buckets.length === 0) {
    return [];
  }
  return Buckets.filter(bucket => {
    return bucket.Name?.includes(`${environment.name}`);
  });
};

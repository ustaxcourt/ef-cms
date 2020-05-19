const { filter } = require('lodash');

exports.getS3Buckets = async ({ environment, s3 }) => {
  const { Buckets } = await s3.listBuckets({}).promise();
  return filter(Buckets, bucket => {
    return bucket.Name.includes(`${environment.name}`);
  });
};

const { getS3 } = require('./getS3');
const { getS3Buckets } = require('./getS3Buckets');
const { sleep } = require('./sleep');

exports.deleteS3Buckets = async ({ environment }) => {
  const s3 = getS3({ environment });

  const buckets = await getS3Buckets({
    environment,
    s3,
  });

  for (const bucket of buckets) {
    const objects = await s3
      .listObjectVersions({ Bucket: bucket.Name, MaxKeys: 1000 })
      .promise();

    console.log(objects.DeleteMarkers.length);

    if (objects.DeleteMarkers.length > 0) {
      await s3
        .deleteObjects({
          Bucket: bucket.Name,
          Delete: {
            Objects: objects.DeleteMarkers.map(object => {
              return { Key: object.Key, VersionId: object.VersionId };
            }),
          },
        })
        .promise();
      console.log('Deleted ', objects.DeleteMarkers.length);
    }
  }

  for (const bucket of buckets) {
    console.log('Deleting', bucket.Name);
    await s3.deleteBucket({ Bucket: bucket.Name }).promise();
    await sleep(5000);
  }

  let resourceCount = buckets.length;

  while (resourceCount > 0) {
    await sleep(5000);
    const refreshedBuckets = await getS3Buckets({
      environment,
      s3,
    });
    console.log(
      'Waiting for buckets to be deleted: ',
      Date(),
      refreshedBuckets.length,
    );
    resourceCount = refreshedBuckets.length;
  }
};

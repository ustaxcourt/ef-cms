const { getS3 } = require('./getS3');
const { getS3Buckets } = require('./getS3Buckets');

exports.deleteS3Buckets = async ({ environment }) => {
  const s3 = getS3({ environment });

  const buckets = await getS3Buckets({
    environment,
    s3,
  });

  for (const bucket of buckets) {
    let numItems;
    const objects = await s3
      .listObjects({
        Bucket: bucket.Name,
        MaxKeys: 1000,
      })
      .promise();

    if (objects.Contents.length > 0) {
      do {
        console.log(
          'Deleting items from S3 Bucket:',
          environment.region,
          bucket.Name,
        );

        await s3
          .deleteObjects({
            Bucket: bucket.Name,
            Delete: {
              Objects: objects.Contents.map(object => {
                return { Key: object.Key };
              }),
            },
          })
          .promise();

        const moreObjects = await s3
          .listObjects({
            Bucket: bucket.Name,
            MaxKeys: 1000,
          })
          .promise();
        numItems = moreObjects.Contents.length;
      } while (numItems > 0);
    }

    let numVersionItems;
    const objectVersions = await s3
      .listObjectVersions({ Bucket: bucket.Name, MaxKeys: 1000 })
      .promise();

    if (objectVersions.Versions.length > 0) {
      do {
        console.log(
          'Deleting version items from S3 Bucket:',
          environment.region,
          bucket.Name,
        );

        await s3
          .deleteObjects({
            Bucket: bucket.Name,
            Delete: {
              Objects: objectVersions.Versions.map(objectVersion => {
                return {
                  Key: objectVersion.Key,
                  VersionId: objectVersion.VersionId,
                };
              }),
            },
          })
          .promise();

        const moreObjectVersions = await s3
          .listObjectVersions({ Bucket: bucket.Name, MaxKeys: 1000 })
          .promise();
        numVersionItems = moreObjectVersions.Versions.length;
      } while (numVersionItems > 0);
    }
  }
};

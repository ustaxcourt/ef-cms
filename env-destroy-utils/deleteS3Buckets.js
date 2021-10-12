const { getS3 } = require('./getS3');
const { getS3Buckets } = require('./getS3Buckets');

exports.deleteS3Buckets = async ({ environment }) => {
  const s3 = getS3({ environment });

  const buckets = await getS3Buckets({
    environment,
    s3,
  });

  for (const bucket of buckets) {
    let objects = await s3
      .listObjectsV2({
        Bucket: bucket.Name,
        MaxKeys: 1000,
      })
      .promise();

    if (objects.Contents.length > 0) {
      do {
        console.log('Deleting items from S3 Bucket:', bucket.Name);

        try {
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
        } catch (e) {
          console.log('Failed to delete items from S3 Bucket:', bucket.Name, e);
        }

        objects = await s3
          .listObjectsV2({
            Bucket: bucket.Name,
            ContinuationToken: objects.NextContinuationToken
              ? objects.NextContinuationToken
              : undefined,
            MaxKeys: 1000,
          })
          .promise();
      } while (objects.Contents.length > 0);
    }

    let objectVersions = await s3
      .listObjectVersions({ Bucket: bucket.Name, MaxKeys: 1000 })
      .promise();

    if (objectVersions.Versions.length > 0) {
      do {
        console.log('Deleting version items from S3 Bucket:', bucket.Name);

        try {
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
              Quiet: false,
            })
            .promise();
        } catch (e) {
          console.log(
            'Failed to delete version items from S3 Bucket:',
            bucket.Name,
            e,
          );
        }

        objectVersions = await s3
          .listObjectVersions({
            Bucket: bucket.Name,
            KeyMarker: objectVersions.NextKeyMarker
              ? objectVersions.NextKeyMarker
              : undefined,

            MaxKeys: 1000,
          })
          .promise();
      } while (objectVersions.Versions.length > 0);
    }
  }
};

import { getS3 } from './getS3';
import { getS3Buckets } from './getS3Buckets';

export const clearS3Buckets = async ({
  environment,
}: {
  environment: { name: string; region: string };
}): Promise<void> => {
  const s3 = getS3({ environment });

  const buckets = await getS3Buckets({
    environment,
    s3,
  });

  for (const bucket of buckets) {
    let bucketContents = await s3.listObjectsV2({
      Bucket: bucket.Name,
      MaxKeys: 1000,
    });

    if (bucketContents.Contents && bucketContents.Contents.length > 0) {
      do {
        console.log('Deleting items from S3 Bucket:', bucket.Name);

        try {
          await s3.deleteObjects({
            Bucket: bucket.Name,
            Delete: {
              Objects: bucketContents.Contents.map(object => {
                return { Key: object.Key };
              }),
            },
          });
        } catch (e) {
          console.log('Failed to delete items from S3 Bucket:', bucket.Name, e);
        }

        bucketContents = await s3.listObjectsV2({
          Bucket: bucket.Name,
          ContinuationToken: bucketContents.NextContinuationToken
            ? bucketContents.NextContinuationToken
            : undefined,
          MaxKeys: 1000,
        });
      } while (bucketContents.Contents && bucketContents.Contents.length > 0);
    }

    let bucketContentVersions = await s3.listObjectVersions({
      Bucket: bucket.Name,
      MaxKeys: 1000,
    });

    if (
      bucketContentVersions.Versions &&
      bucketContentVersions.Versions.length > 0
    ) {
      do {
        console.log('Deleting version items from S3 Bucket:', bucket.Name);

        try {
          await s3.deleteObjects({
            Bucket: bucket.Name,
            Delete: {
              Objects: bucketContentVersions.Versions.map(objectVersion => {
                return {
                  Key: objectVersion.Key,
                  VersionId: objectVersion.VersionId,
                };
              }),
            },
          });
        } catch (e) {
          console.log(
            'Failed to delete version items from S3 Bucket:',
            bucket.Name,
            e,
          );
        }

        bucketContentVersions = await s3.listObjectVersions({
          Bucket: bucket.Name,
          KeyMarker: bucketContentVersions.NextKeyMarker
            ? bucketContentVersions.NextKeyMarker
            : undefined,
          MaxKeys: 1000,
        });
      } while (
        bucketContentVersions.Versions &&
        bucketContentVersions.Versions.length > 0
      );
    }

    let bucketDeleteMarkers = await s3.listObjectVersions({
      Bucket: bucket.Name,
      MaxKeys: 1000,
    });

    if (
      bucketDeleteMarkers.DeleteMarkers &&
      bucketDeleteMarkers.DeleteMarkers.length > 0
    ) {
      do {
        console.log(
          'Deleting delete marker items from S3 Bucket:',
          bucket.Name,
        );

        try {
          await s3.deleteObjects({
            Bucket: bucket.Name,
            Delete: {
              Objects: bucketDeleteMarkers.DeleteMarkers.map(deleteMarker => {
                return {
                  Key: deleteMarker.Key,
                  VersionId: deleteMarker.VersionId,
                };
              }),
            },
          });
        } catch (e) {
          console.log(
            'Failed to delete delete marker items from S3 Bucket:',
            bucket.Name,
            e,
          );
        }

        bucketDeleteMarkers = await s3.listObjectVersions({
          Bucket: bucket.Name,
          KeyMarker: bucketDeleteMarkers.NextKeyMarker
            ? bucketDeleteMarkers.NextKeyMarker
            : undefined,
          MaxKeys: 1000,
        });
      } while (
        bucketDeleteMarkers.DeleteMarkers &&
        bucketDeleteMarkers.DeleteMarkers.length > 0
      );
    }
  }
};

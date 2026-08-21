import {
  DeleteObjectsCommand,
  ListBucketsCommand,
  ListObjectVersionsCommand,
  ListObjectVersionsCommandOutput,
  ObjectIdentifier,
  S3Client,
} from '@aws-sdk/client-s3';

const S3_DELETE_BATCH_SIZE = 1000;

export const truncateAllEnvironmentS3Buckets = async ({
  environmentName,
  s3Client,
}: {
  environmentName: string;
  s3Client: S3Client;
}): Promise<{ [key: string]: number }> => {
  const totals: { [key: string]: number } = {};

  const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
  const environmentBuckets = (Buckets || []).filter(
    (bucket): bucket is { Name: string } =>
      !!bucket.Name && bucket.Name.includes(environmentName),
  );

  for (const bucket of environmentBuckets) {
    const bucketName = bucket.Name;
    let bucketDeleted = 0;
    let keyMarker: string | undefined;
    let versionIdMarker: string | undefined;
    let isTruncated = true;

    while (isTruncated) {
      const listResponse: ListObjectVersionsCommandOutput = await s3Client.send(
        new ListObjectVersionsCommand({
          Bucket: bucketName,
          KeyMarker: keyMarker,
          VersionIdMarker: versionIdMarker,
        }),
      );

      const objectsToDelete: ObjectIdentifier[] = [
        ...(listResponse.Versions || []),
        ...(listResponse.DeleteMarkers || []),
      ]
        .filter(
          (entry): entry is { Key: string; VersionId?: string } => !!entry.Key,
        )
        .map(entry => ({ Key: entry.Key, VersionId: entry.VersionId }));

      for (let i = 0; i < objectsToDelete.length; i += S3_DELETE_BATCH_SIZE) {
        const batch = objectsToDelete.slice(i, i + S3_DELETE_BATCH_SIZE);
        const deleteResponse = await s3Client.send(
          new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: { Objects: batch, Quiet: false },
          }),
        );

        const errors = deleteResponse.Errors || [];
        if (errors.length > 0) {
          const failedDeletes = errors
            .map(
              ({ Key, VersionId, Code, Message }) =>
                `${Key ?? 'unknown-key'}${VersionId ? ` (${VersionId})` : ''}: ${Code ?? 'UnknownError'}${Message ? ` - ${Message}` : ''}`,
            )
            .join(', ');

          throw new Error(
            `Failed to delete one or more S3 object(s) from bucket ${bucketName}: ${failedDeletes}`,
          );
        }

        bucketDeleted += deleteResponse.Deleted?.length ?? 0;
      }

      isTruncated = !!listResponse.IsTruncated;
      keyMarker = listResponse.NextKeyMarker;
      versionIdMarker = listResponse.NextVersionIdMarker;
    }

    console.log(
      `Deleted ${bucketDeleted} object(s) from S3 bucket: ${bucketName}`,
    );
    totals[bucketName] = bucketDeleted;
  }

  return totals;
};

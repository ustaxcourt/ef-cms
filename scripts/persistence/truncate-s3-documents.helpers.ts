import {
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  ListObjectVersionsCommandOutput,
  ObjectIdentifier,
  S3Client,
} from '@aws-sdk/client-s3';

const S3_DELETE_BATCH_SIZE = 1000;

/**
 * Deletes every object (including non-current versions and delete markers)
 * from the application's documents bucket so that the bucket is empty after
 * the call. Uses paginated `ListObjectVersions` + batched `DeleteObjects`.
 */
export const truncateS3DocumentsBucket = async ({
  bucketName,
  s3Client,
}: {
  bucketName: string;
  s3Client: S3Client;
}): Promise<number> => {
  let totalDeleted = 0;
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

      totalDeleted += deleteResponse.Deleted?.length ?? 0;
    }

    isTruncated = !!listResponse.IsTruncated;
    keyMarker = listResponse.NextKeyMarker;
    versionIdMarker = listResponse.NextVersionIdMarker;
  }

  console.log(
    `Deleted ${totalDeleted} object(s) from S3 bucket: ${bucketName}`,
  );
  return totalDeleted;
};

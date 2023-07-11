import { ObjectIdentifier } from '@aws-sdk/client-s3';
import { chunk } from 'lodash';
import {
  diffArraysOfS3ObjectVersions,
  diffArraysOfS3Objects,
  listAllObjectVersions,
  listAllObjects,
} from '../../../../../shared/admin-tools/aws/s3Helper';

export const generateBucketSyncQueueEntries = async ({
  destinationBucket,
  sourceBucket,
}: {
  destinationBucket: string;
  sourceBucket: string;
}): Promise<
  {
    action: string;
    Bucket?: string;
    destinationBucket?: string;
    Objects: ObjectIdentifier[];
    sourceBucket?: string;
  }[]
> => {
  const [
    destinationObjects,
    destinationObjectVersions,
    sourceObjects,
    sourceObjectVersions,
  ] = await Promise.all([
    listAllObjects({ Bucket: destinationBucket }),
    listAllObjectVersions({ Bucket: destinationBucket }),
    listAllObjects({ Bucket: sourceBucket }),
    listAllObjectVersions({ Bucket: sourceBucket }),
  ]);

  const queueEntries = [] as {
    action: string;
    Bucket?: string;
    destinationBucket?: string;
    Objects: ObjectIdentifier[];
    sourceBucket?: string;
  }[];

  const objectsToDelete = diffArraysOfS3Objects({
    objectsA: destinationObjects,
    objectsB: sourceObjects,
  });
  console.log(
    `Found ${objectsToDelete.length} objects in the destination bucket that do not exist in the source bucket.`,
  );
  const objectKeysToDelete = objectsToDelete.map(obj => obj.Key);
  const deleteObjectsChunks = chunk(objectsToDelete, 1000);
  for (const deleteObjectsChunk of deleteObjectsChunks) {
    queueEntries.push({
      Bucket: destinationBucket,
      Objects: deleteObjectsChunk.map(obj => {
        return { Key: obj.Key } as ObjectIdentifier;
      }),
      action: 'DELETE',
    });
  }
  console.log(
    `Divided the objects to delete into ${deleteObjectsChunks.length} chunks of 1000`,
  );

  const allVersionsThatDiffer = diffArraysOfS3ObjectVersions({
    versionsA: destinationObjectVersions,
    versionsB: sourceObjectVersions,
  });
  const versionsToDelete = allVersionsThatDiffer.filter(
    objVer => !objectKeysToDelete.includes(objVer.Key),
  );
  console.log(
    `Found ${versionsToDelete.length} object versions in the destination bucket that do not exist in the source bucket.`,
  );
  const deleteVersionsChunks = chunk(versionsToDelete, 1000);
  for (const deleteVersionsChunk of deleteVersionsChunks) {
    queueEntries.push({
      Bucket: destinationBucket,
      Objects: deleteVersionsChunk.map(objVer => {
        return {
          Key: objVer.Key,
          VersionId: objVer.VersionId,
        } as ObjectIdentifier;
      }),
      action: 'DELETE',
    });
  }
  console.log(
    `Divided the versions to delete into ${deleteVersionsChunks.length} chunks of 1000`,
  );

  const versionsToCopy = diffArraysOfS3ObjectVersions({
    versionsA: sourceObjectVersions,
    versionsB: destinationObjectVersions,
  });
  console.log(
    `Found ${versionsToCopy.length} object versions in the source bucket that do not exist in the destination bucket.`,
  );
  const copyVersionsChunks = chunk(versionsToCopy, 100);
  for (const copyVersionsChunk of copyVersionsChunks) {
    queueEntries.push({
      Objects: copyVersionsChunk.map(objVer => {
        return {
          Key: objVer.Key,
          VersionId: objVer.VersionId,
        } as ObjectIdentifier;
      }),
      action: 'COPY',
      destinationBucket,
      sourceBucket,
    });
  }
  console.log(
    `Divided the versions to copy into ${copyVersionsChunks.length} chunks of 100`,
  );

  return queueEntries;
};

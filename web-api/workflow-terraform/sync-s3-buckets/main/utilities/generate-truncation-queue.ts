import { ObjectIdentifier } from '@aws-sdk/client-s3';
import { chunk } from 'lodash';
import {
  listAllDeleteMarkers,
  listAllObjects,
} from '../../../../../shared/admin-tools/aws/s3Helper';

export const generateBucketTruncationQueueEntries = async ({
  Bucket,
}: {
  Bucket: string;
}): Promise<
  {
    action: string;
    Bucket: string;
    Objects: ObjectIdentifier[];
  }[]
> => {
  const [objects, deleteMarkers] = await Promise.all([
    listAllObjects({ Bucket }),
    listAllDeleteMarkers({ Bucket }),
  ]);

  const queueEntries = [] as {
    action: string;
    Bucket: string;
    Objects: ObjectIdentifier[];
  }[];

  console.log(`Found ${objects.length} objects in the bucket.`);
  const objectsChunks = chunk(objects, 1000);
  for (const objectsChunk of objectsChunks) {
    queueEntries.push({
      Bucket,
      Objects: objectsChunk.map(obj => {
        return { Key: obj.Key } as ObjectIdentifier;
      }),
      action: 'DELETE',
    });
  }
  console.log(
    `Divided the objects into ${objectsChunks.length} chunks of 1000`,
  );

  console.log(`Found ${deleteMarkers.length} leftover delete markers.`);
  const deleteMarkersChunks = chunk(deleteMarkers, 1000);
  for (const deleteMarkersChunk of deleteMarkersChunks) {
    queueEntries.push({
      Bucket,
      Objects: deleteMarkersChunk.map(deleteMarker => {
        return {
          Key: deleteMarker.Key,
          VersionId: deleteMarker.VersionId || undefined,
        } as ObjectIdentifier;
      }),
      action: 'DELETE',
    });
  }
  console.log(
    `Divided the delete markers into ${deleteMarkersChunks.length} chunks of 1000`,
  );

  return queueEntries;
};

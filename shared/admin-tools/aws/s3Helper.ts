import {
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  ListObjectsV2Command,
  ObjectIdentifier,
  ObjectVersion,
  S3Client,
  _Object,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });
const MaxKeys = 1000;

export const getNextChunkOfObjects = async ({
  Bucket,
  ContinuationToken,
}: {
  Bucket: string;
  ContinuationToken: string | undefined;
}): Promise<{
  nextContinuationToken: string | undefined;
  objectsChunk: _Object[] | undefined;
}> => {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket,
    ContinuationToken,
    MaxKeys,
  });
  let objectsChunk;
  let nextContinuationToken;
  try {
    const listObjectsResponse = await s3Client.send(listObjectsCommand);
    if ('Contents' in listObjectsResponse && listObjectsResponse.Contents) {
      objectsChunk = listObjectsResponse.Contents;
    }
    if ('NextContinuationToken' in listObjectsResponse) {
      nextContinuationToken = listObjectsResponse.NextContinuationToken;
    }
  } catch (err) {
    console.error('Error listing bucket contents', err);
  }
  return { nextContinuationToken, objectsChunk };
};

export const getNextChunkOfObjectVersions = async ({
  Bucket,
  KeyMarker,
}: {
  Bucket: string;
  KeyMarker: string | undefined;
}): Promise<{
  nextKeyMarker: string | undefined;
  objectVersionsChunk: ObjectVersion[] | undefined;
}> => {
  const listObjectVersionsCommand = new ListObjectVersionsCommand({
    Bucket,
    KeyMarker,
    MaxKeys,
  });
  let objectVersionsChunk;
  let nextKeyMarker;
  try {
    const listObjectVersionsResponse = await s3Client.send(
      listObjectVersionsCommand,
    );
    if ('Versions' in listObjectVersionsResponse) {
      objectVersionsChunk = listObjectVersionsResponse.Versions;
    }
    if ('NextKeyMarker' in listObjectVersionsResponse) {
      nextKeyMarker = listObjectVersionsResponse.NextKeyMarker;
    }
  } catch (err) {
    console.error('Error listing object versions', err);
  }
  return { nextKeyMarker, objectVersionsChunk };
};

export const getNextChunkOfDeleteMarkers = async ({
  Bucket,
  KeyMarker,
}: {
  Bucket: string;
  KeyMarker: string | undefined;
}): Promise<{
  deleteMarkersChunk: ObjectVersion[] | undefined;
  nextDeleteKeyMarker: string | undefined;
}> => {
  const listDeleteMarkersCommand = new ListObjectVersionsCommand({
    Bucket,
    KeyMarker,
    MaxKeys,
  });
  let deleteMarkersChunk;
  let nextDeleteKeyMarker;
  try {
    const listDeleteMarkersResponse = await s3Client.send(
      listDeleteMarkersCommand,
    );
    if ('DeleteMarkers' in listDeleteMarkersResponse) {
      deleteMarkersChunk = listDeleteMarkersResponse.DeleteMarkers;
    }
    if ('NextKeyMarker' in listDeleteMarkersResponse) {
      nextDeleteKeyMarker = listDeleteMarkersResponse.NextKeyMarker;
    }
  } catch (err) {
    console.error('Error listing object versions', err);
  }
  return { deleteMarkersChunk, nextDeleteKeyMarker };
};

export const listAllObjects = async ({
  Bucket,
}: {
  Bucket: string;
}): Promise<_Object[]> => {
  let allObjects;
  let hasMore = true;
  let ContinuationToken;

  while (hasMore) {
    const { nextContinuationToken, objectsChunk } = await getNextChunkOfObjects(
      {
        Bucket,
        ContinuationToken: ContinuationToken || undefined,
      },
    );
    hasMore = !!nextContinuationToken;
    ContinuationToken = nextContinuationToken;
    if (objectsChunk && objectsChunk.length) {
      if (!allObjects) {
        allObjects = objectsChunk;
      } else {
        allObjects = allObjects.concat(objectsChunk);
      }
    }
  }

  return allObjects;
};

export const deleteObjects = async ({
  Bucket,
  Objects,
}: {
  Bucket: string;
  Objects: ObjectIdentifier[];
}) => {
  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket,
    Delete: { Objects },
  });
  try {
    const { Deleted: deletedObjects } = await s3Client.send(
      deleteObjectsCommand,
    );
    console.log(
      `Deleted ${deletedObjects ? deletedObjects.length : 0} objects`,
    );
  } catch (err) {
    console.error('Error deleting objects', err);
  }
};

import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  DeletedObject,
  ListObjectVersionsCommand,
  ListObjectsV2Command,
  ObjectIdentifier,
  ObjectVersion,
  S3Client,
  _Error,
  _Object,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });
const MaxKeys = 1000;

// export const RETRYABLE_ERRORS = [
//   'InternalError',
//   'RequestTimeout',
//   'ServiceUnavailable',
//   'SlowDown',
// ];

export const getNextChunkOfObjects = async ({
  Bucket,
  ContinuationToken,
}: {
  Bucket: string;
  ContinuationToken: string | undefined;
}): Promise<{
  isTruncated: boolean | undefined;
  nextContinuationToken: string | undefined;
  objectsChunk: _Object[] | undefined;
}> => {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket,
    ContinuationToken,
    MaxKeys,
  });
  try {
    const {
      Contents: objectsChunk,
      IsTruncated: isTruncated,
      NextContinuationToken: nextContinuationToken,
    } = await s3Client.send(listObjectsCommand);
    return { isTruncated, nextContinuationToken, objectsChunk };
  } catch (err) {
    console.error('Error listing bucket contents', err);
  }
  return {
    isTruncated: undefined,
    nextContinuationToken: undefined,
    objectsChunk: undefined,
  };
};

export const getNextChunkOfObjectVersions = async ({
  Bucket,
  KeyMarker,
}: {
  Bucket: string;
  KeyMarker: string | undefined;
}): Promise<{
  isTruncated: boolean | undefined;
  nextKeyMarker: string | undefined;
  objectVersionsChunk: ObjectVersion[] | undefined;
}> => {
  const listObjectVersionsCommand = new ListObjectVersionsCommand({
    Bucket,
    KeyMarker,
    MaxKeys,
  });
  try {
    const {
      IsTruncated: isTruncated,
      NextKeyMarker: nextKeyMarker,
      Versions: objectVersionsChunk,
    } = await s3Client.send(listObjectVersionsCommand);
    return { isTruncated, nextKeyMarker, objectVersionsChunk };
  } catch (err) {
    console.error('Error listing object versions', err);
  }
  return {
    isTruncated: undefined,
    nextKeyMarker: undefined,
    objectVersionsChunk: undefined,
  };
};

export const getNextChunkOfDeleteMarkers = async ({
  Bucket,
  KeyMarker,
}: {
  Bucket: string;
  KeyMarker: string | undefined;
}): Promise<{
  deleteMarkersChunk: ObjectVersion[] | undefined;
  isTruncated: boolean | undefined;
  nextDeleteKeyMarker: string | undefined;
}> => {
  const listDeleteMarkersCommand = new ListObjectVersionsCommand({
    Bucket,
    KeyMarker,
    MaxKeys,
  });
  try {
    const {
      DeleteMarkers: deleteMarkersChunk,
      IsTruncated: isTruncated,
      NextKeyMarker: nextDeleteKeyMarker,
    } = await s3Client.send(listDeleteMarkersCommand);
    return { deleteMarkersChunk, isTruncated, nextDeleteKeyMarker };
  } catch (err) {
    console.error('Error listing object versions', err);
  }
  return {
    deleteMarkersChunk: undefined,
    isTruncated: undefined,
    nextDeleteKeyMarker: undefined,
  };
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
    const { isTruncated, nextContinuationToken, objectsChunk } =
      await getNextChunkOfObjects({
        Bucket,
        ContinuationToken: ContinuationToken || undefined,
      });
    hasMore = isTruncated || !!nextContinuationToken;
    ContinuationToken = nextContinuationToken;
    if (objectsChunk && objectsChunk.length) {
      allObjects = allObjects?.concat(objectsChunk) || objectsChunk;
    }
  }

  return allObjects;
};

export const listAllObjectVersions = async ({
  Bucket,
}: {
  Bucket: string;
}): Promise<ObjectVersion[]> => {
  let allObjectVersions;
  let hasMore = true;
  let KeyMarker;

  while (hasMore) {
    const { isTruncated, nextKeyMarker, objectVersionsChunk } =
      await getNextChunkOfObjectVersions({
        Bucket,
        KeyMarker: KeyMarker || undefined,
      });
    hasMore = isTruncated || !!nextKeyMarker;
    KeyMarker = nextKeyMarker;
    if (objectVersionsChunk && objectVersionsChunk.length) {
      allObjectVersions =
        allObjectVersions?.concat(objectVersionsChunk) || objectVersionsChunk;
    }
  }

  return allObjectVersions;
};

export const listAllDeleteMarkers = async ({
  Bucket,
}: {
  Bucket: string;
}): Promise<ObjectVersion[]> => {
  let allDeleteMarkers;
  let hasMore = true;
  let KeyMarker;

  while (hasMore) {
    const { deleteMarkersChunk, isTruncated, nextDeleteKeyMarker } =
      await getNextChunkOfDeleteMarkers({
        Bucket,
        KeyMarker: KeyMarker || undefined,
      });
    hasMore = isTruncated || !!nextDeleteKeyMarker;
    KeyMarker = nextDeleteKeyMarker;
    if (deleteMarkersChunk && deleteMarkersChunk.length) {
      allDeleteMarkers =
        allDeleteMarkers?.concat(deleteMarkersChunk) || deleteMarkersChunk;
    }
  }

  return allDeleteMarkers;
};

export const deleteObjects = async ({
  Bucket,
  Objects,
}: {
  Bucket: string;
  Objects: ObjectIdentifier[];
}): Promise<{
  Deleted: DeletedObject[] | undefined;
  Errors: _Error[] | undefined;
}> => {
  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket,
    Delete: { Objects },
  });
  try {
    const { Deleted, Errors } = await s3Client.send(deleteObjectsCommand);
    console.log(`Deleted ${Deleted ? Deleted.length : 0} objects`);
    return { Deleted, Errors };
  } catch (err) {
    console.error('Error deleting objects', err);
  }
  const Errors = Objects.map(obj => {
    return { Key: obj.Key, VersionId: obj.VersionId || undefined };
  }) as _Error[];
  return { Deleted: undefined, Errors };
};

export const copyObject = async ({
  destinationBucket,
  object,
  sourceBucket,
}: {
  destinationBucket: string;
  object: ObjectIdentifier;
  sourceBucket: string;
}): Promise<{
  Copied: ObjectIdentifier | undefined;
  Error: _Error | undefined;
}> => {
  let CopySource = `${sourceBucket}/${object.Key}`;
  if ('VersionId' in object && object.VersionId) {
    CopySource += `?versionId=${object.VersionId}`;
  }
  const copyObjectCommand = new CopyObjectCommand({
    Bucket: destinationBucket,
    CopySource,
    Key: object.Key,
  });
  try {
    await s3Client.send(copyObjectCommand);
    return { Copied: object, Error: undefined };
  } catch (err) {
    console.error('Error copying object', err);
  }
  return {
    Copied: undefined,
    Error: {
      Key: object.Key,
      VersionId: object.VersionId || undefined,
    } as _Error,
  };
};

export const copyObjects = async ({
  destinationBucket,
  Objects,
  sourceBucket,
}: {
  destinationBucket: string;
  Objects: ObjectIdentifier[];
  sourceBucket: string;
}): Promise<{
  Copied: ObjectIdentifier[] | undefined;
  Errors: _Error[] | undefined;
}> => {
  const copyResults = await Promise.all(
    Objects.map(object => {
      return copyObject({ destinationBucket, object, sourceBucket });
    }),
  );
  const Copied = copyResults
    .filter(copyResult => !!copyResult.Copied)
    .map(copyResult => copyResult.Copied) as ObjectIdentifier[];
  const Errors = copyResults
    .filter(copyResult => !!copyResult.Error)
    .map(copyResult => copyResult.Error) as _Error[];
  return { Copied: Copied || undefined, Errors: Errors || undefined };
};

export const diffArraysOfS3Objects = ({
  objectsA,
  objectsB,
}: {
  objectsA: _Object[];
  objectsB: _Object[];
}): _Object[] => {
  if (typeof objectsA === 'undefined' || typeof objectsB === 'undefined') {
    return [] as _Object[];
  }
  const objectKeysA = objectsA.map(obj => obj.Key);
  const objectKeysB = objectsB.map(obj => obj.Key);
  const diff = objectKeysA.filter(objKey => !objectKeysB.includes(objKey));
  return objectsA.filter(obj => diff.includes(obj.Key));
};

export const diffArraysOfS3ObjectVersions = ({
  versionsA,
  versionsB,
}: {
  versionsA: ObjectVersion[];
  versionsB: ObjectVersion[];
}): ObjectVersion[] => {
  if (typeof versionsA === 'undefined' || typeof versionsB === 'undefined') {
    return [] as ObjectVersion[];
  }
  const versionIdsA = versionsA.map(objVer => {
    return `${objVer.Key}.${objVer.VersionId}`;
  });
  const versionIdsB = versionsB.map(objVer => {
    return `${objVer.Key}.${objVer.VersionId}`;
  });
  const diff =
    versionIdsA?.filter(objVerId => !versionIdsB.includes(objVerId)) ?? [];
  return versionsA.filter(objVer =>
    diff.includes(`${objVer.Key}.${objVer.VersionId}`),
  );
};

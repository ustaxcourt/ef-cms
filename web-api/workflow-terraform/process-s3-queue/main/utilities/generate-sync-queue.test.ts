import { ObjectVersion, _Object } from '@aws-sdk/client-s3';
import { generateBucketSyncQueueEntries } from './generate-sync-queue';
import {
  listAllObjectVersions,
  listAllObjects,
} from '../../../../../shared/admin-tools/aws/s3Helper';
const { v4: uuidv4 } = require('uuid');

jest.mock('../../../../../shared/admin-tools/aws/s3Helper', () => {
  const s3Helper = jest.requireActual(
    '../../../../../shared/admin-tools/aws/s3Helper',
  );
  return {
    diffArraysOfS3ObjectVersions: s3Helper.diffArraysOfS3ObjectVersions,
    diffArraysOfS3Objects: s3Helper.diffArraysOfS3Objects,
    listAllObjectVersions: jest.fn(),
    listAllObjects: jest.fn(),
  };
});
const listAllObjectsMock = listAllObjects as jest.Mock;
const listAllObjectVersionsMock = listAllObjectVersions as jest.Mock;

const fileInBothBuckets = uuidv4();
const fileInBothBucketsVersion1 = uuidv4();
const fileInBothBucketsVersion2 = uuidv4();

const generateListOfSourceObjects = (): _Object[] => {
  let sourceBucketObjects = [{ Key: fileInBothBuckets } as _Object];
  for (let i = 0; i < 125; i++) {
    sourceBucketObjects.push({ Key: uuidv4() } as _Object);
  }
  return sourceBucketObjects;
};
const mockListOfSourceObjects = generateListOfSourceObjects();

const generateListOfSourceObjectVersions = (): ObjectVersion[] => {
  let sourceBucketObjectVersions = [
    {
      Key: fileInBothBuckets,
      VersionId: fileInBothBucketsVersion1,
    } as ObjectVersion,
    {
      Key: fileInBothBuckets,
      VersionId: fileInBothBucketsVersion2,
    } as ObjectVersion,
    {
      Key: fileInBothBuckets,
      VersionId: uuidv4(),
    } as ObjectVersion,
  ];
  for (const obj of mockListOfSourceObjects) {
    if (obj.Key !== fileInBothBuckets) {
      for (let i = 0; i < 2; i++) {
        sourceBucketObjectVersions.push({
          Key: obj.Key,
          VersionId: uuidv4(),
        } as ObjectVersion);
      }
    }
  }
  return sourceBucketObjectVersions;
};
const mockListOfSourceObjectVersions = generateListOfSourceObjectVersions();

const generateListOfDestinationObjects = (): _Object[] => {
  let destinationBucketObjects = [{ Key: fileInBothBuckets } as _Object];
  for (let i = 0; i < 1250; i++) {
    destinationBucketObjects.push({ Key: uuidv4() } as _Object);
  }
  return destinationBucketObjects;
};
const mockListOfDestinationObjects = generateListOfDestinationObjects();

const generateListOfDestinationObjectVersions = (): ObjectVersion[] => {
  let destinationBucketObjectVersions = [
    {
      Key: fileInBothBuckets,
      VersionId: fileInBothBucketsVersion1,
    } as ObjectVersion,
    {
      Key: fileInBothBuckets,
      VersionId: uuidv4(),
    } as ObjectVersion,
  ];
  for (const obj of mockListOfDestinationObjects) {
    if (obj.Key !== fileInBothBuckets) {
      for (let i = 0; i < 2; i++) {
        destinationBucketObjectVersions.push({
          Key: obj.Key,
          VersionId: uuidv4(),
        } as ObjectVersion);
      }
    }
  }
  return destinationBucketObjectVersions;
};
const mockListOfDestinationObjectVersions =
  generateListOfDestinationObjectVersions();

describe('generate-sync-queue', () => {
  console.log = () => null;
  console.error = () => null;

  it('generates a queue of delete and copy events', async () => {
    // to ensure the requests are chunked properly, we've mocked:
    //   * 1 object that exists in both buckets:
    //       * 2 versions in the destination bucket, 1 of which does not exist in the source bucket
    //       * 3 versions in the source bucket, 2 of which do not exist in the destination bucket
    //   * 1250 objects in the destination bucket that do not exist in the source bucket
    //   * 125 objects in the source bucket that do not exist in the destination bucket
    //       * 2 versions each
    listAllObjectsMock
      .mockReturnValueOnce(Promise.resolve(mockListOfDestinationObjects))
      .mockReturnValueOnce(Promise.resolve(mockListOfSourceObjects));
    listAllObjectVersionsMock
      .mockReturnValueOnce(Promise.resolve(mockListOfDestinationObjectVersions))
      .mockReturnValueOnce(Promise.resolve(mockListOfSourceObjectVersions));

    const queueEntries = await generateBucketSyncQueueEntries({
      destinationBucket: 'destination-bucket',
      sourceBucket: 'source-bucket',
    });

    expect(listAllObjects).toHaveBeenCalledTimes(2);
    expect(listAllObjectVersions).toHaveBeenCalledTimes(2);

    const deleteEvents = queueEntries.filter(qe => qe.action === 'DELETE');
    expect(deleteEvents.length).toEqual(3);
    expect(deleteEvents[0].Objects.length).toEqual(1000); // objects, pg 1
    expect(deleteEvents[1].Objects.length).toEqual(250); // objects, pg 2
    expect(deleteEvents[2].Objects.length).toEqual(1); // 1 version

    const copyEvents = queueEntries.filter(qe => qe.action === 'COPY');
    expect(copyEvents.length).toEqual(3);
    expect(copyEvents[0].Objects.length).toEqual(100);
    expect(copyEvents[1].Objects.length).toEqual(100);
    expect(copyEvents[2].Objects.length).toEqual(52); // 250 + 2 new versions of the object that exists in both buckets
  });
});

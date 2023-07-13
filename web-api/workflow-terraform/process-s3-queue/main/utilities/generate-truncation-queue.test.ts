import { ObjectVersion, _Object } from '@aws-sdk/client-s3';
import { generateBucketTruncationQueueEntries } from './generate-truncation-queue';
import {
  listAllDeleteMarkers,
  listAllObjects,
} from '../../../../../shared/admin-tools/aws/s3Helper';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../../../shared/admin-tools/aws/s3Helper', () => ({
  listAllDeleteMarkers: jest.fn(),
  listAllObjects: jest.fn(),
}));
const listAllDeleteMarkersMock = listAllDeleteMarkers as jest.Mock;
const listAllObjectsMock = listAllObjects as jest.Mock;

const generateListOfObjects = (): _Object[] => {
  let objects = [];
  for (let i = 0; i < 1250; i++) {
    objects.push({ Key: uuidv4() } as _Object);
  }
  return objects;
};
const mockListOfObjects = generateListOfObjects();

const generateListOfDeleteMarkers = (): ObjectVersion[] => {
  let deleteMarkers = [];
  for (let i = 0; i < 1005; i++) {
    deleteMarkers.push({
      Key: uuidv4(),
      VersionId: uuidv4(),
    } as ObjectVersion);
  }
  return deleteMarkers;
};
const mockListOfDeleteMarkers = generateListOfDeleteMarkers();

describe('generate-truncation-queue', () => {
  console.log = () => null;
  console.error = () => null;

  it('generates a queue of delete events', async () => {
    listAllObjectsMock.mockReturnValueOnce(Promise.resolve(mockListOfObjects));
    listAllDeleteMarkersMock.mockReturnValueOnce(
      Promise.resolve(mockListOfDeleteMarkers),
    );

    const queueEntries = await generateBucketTruncationQueueEntries({
      Bucket: 'jest-bucket',
    });

    expect(queueEntries.filter(qe => qe.action !== 'DELETE').length).toEqual(0);
    expect(queueEntries.length).toEqual(4);
    expect(queueEntries[0].Objects.length).toEqual(1000); // objects, pg 1
    expect(queueEntries[1].Objects.length).toEqual(250); // objects, pg 2
    expect(queueEntries[2].Objects.length).toEqual(1000); // delete markers, pg 1
    expect(queueEntries[3].Objects.length).toEqual(5); // delete markers, pg 2
  });
});

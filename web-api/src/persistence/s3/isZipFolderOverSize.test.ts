import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { isZipFolderOverSize } from '@web-api/persistence/s3/isZipFolderOverSize';

describe('isZipFolderOverSize', () => {
  beforeEach(() => {
    applicationContext.getStorageClient.mockImplementation(() => {
      return {
        headObject: () => ({
          ContentLength: 1,
        }),
      };
    });
  });

  it('should return false if the zip folder does not equal or greater than size', async () => {
    const TEST_DOCUMENTS = [
      { key: '1', useTempBucket: false },
      { key: '2', useTempBucket: true },
      { key: '3', useTempBucket: false },
    ];

    const restult = await isZipFolderOverSize(applicationContext, {
      documents: TEST_DOCUMENTS,
      sizeInGB: 1,
    });

    expect(restult).toEqual(false);
  });

  it('should return true if the zip folder does equal or greater than size', async () => {
    const TEST_DOCUMENTS = [
      { key: '1', useTempBucket: false },
      { key: '2', useTempBucket: true },
      { key: '3', useTempBucket: false },
    ];

    const headObjectSpy = jest.fn().mockImplementation(() => ({
      ContentLength: 0.34 * 1024 * 1024 * 1024,
    }));

    applicationContext.getStorageClient.mockImplementation(() => {
      return {
        headObject: headObjectSpy,
      };
    });

    const restult = await isZipFolderOverSize(applicationContext, {
      documents: TEST_DOCUMENTS,
      sizeInGB: 1,
    });

    expect(restult).toEqual(true);
    const headObjectCalls = headObjectSpy.mock.calls;
    expect(headObjectCalls.length).toEqual(3);
    expect(headObjectCalls).toEqual([
      [{ Bucket: 'MockDocumentBucketNameNotTemp', Key: '1' }],
      [{ Bucket: 'MockDocumentBucketName', Key: '2' }],
      [{ Bucket: 'MockDocumentBucketNameNotTemp', Key: '3' }],
    ]);
  });

  it('should return 0 if document is not found', async () => {
    const TEST_DOCUMENTS = [
      { key: '1', useTempBucket: false },
      { key: '2', useTempBucket: true },
      { key: '3', useTempBucket: false },
    ];

    const headObjectSpy = jest.fn().mockImplementation(() => {
      throw new Error('TEST ERROR');
    });

    applicationContext.getStorageClient.mockImplementation(() => {
      return {
        headObject: headObjectSpy,
      };
    });

    await expect(
      await isZipFolderOverSize(applicationContext, {
        documents: TEST_DOCUMENTS,
        sizeInGB: 1,
      }),
    ).toEqual(false);
  });

  it('should return true if size initially already greater than size', async () => {
    const TEST_DOCUMENTS = [
      { key: '1', useTempBucket: false },
      { key: '2', useTempBucket: true },
      { key: '3', useTempBucket: false },
    ];

    const headObjectSpy = jest.fn().mockImplementation(() => {
      return {
        ContentLength: 1,
      };
    });

    applicationContext.getStorageClient.mockImplementation(() => {
      return {
        headObject: headObjectSpy,
      };
    });

    const results = await isZipFolderOverSize(applicationContext, {
      documents: TEST_DOCUMENTS,
      sizeInGB: -1,
    });

    expect(results).toEqual(true);
  });
});

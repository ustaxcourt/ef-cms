import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isFileExists } from './isFileExists';

describe('isFileExists', () => {
  beforeAll(() => {
    applicationContext
      .getStorageClient()
      .headObject.mockImplementationOnce(() => {
        return { promise: () => Promise.resolve('I found it!') };
      })
      .mockImplementationOnce(() => {
        return { promise: () => Promise.resolve('I found it!') };
      })
      .mockImplementation(() => {
        throw new Error('head request failed');
      });
  });

  it('makes a head request to storage client to determine existence of a file', async () => {
    const result = await isFileExists({
      applicationContext,
      key: '867-5309',
    });
    expect(result).toEqual(true);
  });

  it('makes a head request to storage client to determine existence of a file in the temp bucket', async () => {
    const tempDocumentsBucketName = 'i-am-the-temp-bucket';
    applicationContext.environment.tempDocumentsBucketName =
      tempDocumentsBucketName;

    const result = await isFileExists({
      applicationContext,
      key: '867-5309',
      useTempBucket: true,
    });

    expect(result).toEqual(true);
    expect(
      applicationContext.getStorageClient().headObject.mock.calls[0][0].Bucket,
    ).toEqual(tempDocumentsBucketName);
  });

  it('returns false if an error is thrown by headObject function', async () => {
    expect(
      await isFileExists({
        applicationContext,
        key: 'jenny-not-found',
      }),
    ).toBe(false);
  });
});

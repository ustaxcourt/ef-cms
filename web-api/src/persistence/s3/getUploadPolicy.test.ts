import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUploadPolicy } from './getUploadPolicy';

describe('getUploadPolicy', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    applicationContext
      .getStorageClient()
      .createPresignedPost.mockImplementation((options, cb) =>
        cb(null, 'http://localhost'),
      );

    const result = await getUploadPolicy({
      applicationContext,
      key: 'test',
    });
    expect(result).toEqual('http://localhost');
  });

  it('rejects if an error is thrown', async () => {
    applicationContext
      .getStorageClient()
      .createPresignedPost.mockImplementation((options, cb) =>
        cb('error', 'http://localhost'),
      );
    let error;
    try {
      await getUploadPolicy({
        applicationContext,
        key: 'test',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});

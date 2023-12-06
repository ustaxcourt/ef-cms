import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPublicDownloadPolicyUrl } from './getPublicDownloadPolicyUrl';

describe('getPublicDownloadPolicyUrl', () => {
  it('calls the s3 getSignedUrl method with the given key returning a URL', async () => {
    const key = '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1';
    applicationContext
      .getStorageClient()
      .getSignedUrl.mockImplementation((method, options, cb) =>
        cb(null, `http://example.com/document/${options.Key}`),
      );
    const result = await getPublicDownloadPolicyUrl({
      applicationContext,
      key,
    });
    expect(result).toEqual({
      url: `http://example.com/document/${key}`,
    });
  });

  it('rejects if an error is thrown', async () => {
    const key = '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1';
    applicationContext
      .getStorageClient()
      .getSignedUrl.mockImplementation((method, options, cb) =>
        cb('error', `http://example.com/document/${options.key}`),
      );

    let error;
    try {
      await getPublicDownloadPolicyUrl({
        applicationContext,
        key,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});

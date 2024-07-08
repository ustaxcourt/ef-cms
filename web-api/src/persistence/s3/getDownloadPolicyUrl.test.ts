import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { environment } from '@web-api/environment';
import { getDownloadPolicyUrl } from './getDownloadPolicyUrl';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('http://localhost'),
}));

describe('getDownloadPolicyUrl', () => {
  const defaultBucketName = 'aBucket';
  const tempBucketName = 'aTempBucket';

  environment.documentsBucketName = defaultBucketName;
  environment.tempDocumentsBucketName = tempBucketName;

  it('returns a signed URL from the storage client (s3)', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      filename: 'file.pdf',
      key: '123',
    });

    expect(result).toEqual({ url: 'http://localhost' });
    expect((getSignedUrl as jest.Mock).mock.calls[0][1].input.Bucket).toEqual(
      defaultBucketName,
    );
  });

  it('returns a signed URL from the storage client using the temp bucket when the useTempBucket param is true', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      filename: 'test.pdf',
      key: '123',
      useTempBucket: true,
    });

    expect(result).toEqual({ url: 'http://localhost' });
    expect((getSignedUrl as jest.Mock).mock.calls[0][1].input.Bucket).toEqual(
      tempBucketName,
    );
  });

  it('should return a URL intended for viewing inline in a web browser when filename has NOT been provided', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      filename: undefined,
      key: '123',
      useTempBucket: true,
    });

    expect(result).toEqual({ url: 'http://localhost' });
  });
});

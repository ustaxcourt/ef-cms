import { MAX_FILE_SIZE_BYTES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getUploadPolicy } from './getUploadPolicy';
jest.mock('@aws-sdk/s3-presigned-post', () => ({
  createPresignedPost: jest.fn(),
}));

describe('getUploadPolicy', () => {
  it('should make a post request to the expected endpoint with the expected data', async () => {
    const mockKey = 'test';

    await getUploadPolicy({
      applicationContext,
      key: mockKey,
    });

    expect((createPresignedPost as jest.Mock).mock.calls[0][1]).toEqual({
      Bucket: applicationContext.environment.documentsBucketName,
      Conditions: [
        ['starts-with', '$key', mockKey],
        ['starts-with', '$Content-Type', ''],
        ['content-length-range', 0, MAX_FILE_SIZE_BYTES],
      ],
      Key: mockKey,
    });
  });
});

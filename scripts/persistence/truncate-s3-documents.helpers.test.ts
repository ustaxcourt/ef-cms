import {
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { truncateS3DocumentsBucket } from './truncate-s3-documents.helpers';

const s3Mock = mockClient(S3Client);

describe('truncateS3DocumentsBucket', () => {
  const bucketName = 'efcms-documents-local';

  beforeEach(() => {
    s3Mock.reset();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('paginates ListObjectVersions and deletes versions and delete-markers', async () => {
    s3Mock
      .on(ListObjectVersionsCommand)
      .resolvesOnce({
        Versions: [
          { Key: 'a.pdf', VersionId: 'v1' },
          { Key: 'b.pdf', VersionId: 'v2' },
        ],
        DeleteMarkers: [{ Key: 'c.pdf', VersionId: 'v3' }],
        IsTruncated: true,
        NextKeyMarker: 'b.pdf',
        NextVersionIdMarker: 'v2',
      })
      .resolvesOnce({
        Versions: [{ Key: 'd.pdf', VersionId: 'v4' }],
        IsTruncated: false,
      });

    s3Mock.on(DeleteObjectsCommand).resolves({});

    const s3Client = new S3Client({});
    const total = await truncateS3DocumentsBucket({ bucketName, s3Client });

    expect(total).toBe(4);
    const listCalls = s3Mock.commandCalls(ListObjectVersionsCommand);
    expect(listCalls).toHaveLength(2);
    expect(listCalls[1].args[0].input).toMatchObject({
      Bucket: bucketName,
      KeyMarker: 'b.pdf',
      VersionIdMarker: 'v2',
    });

    const deleteCalls = s3Mock.commandCalls(DeleteObjectsCommand);
    expect(deleteCalls).toHaveLength(2);
    expect(deleteCalls[0].args[0].input).toMatchObject({
      Bucket: bucketName,
      Delete: {
        Objects: [
          { Key: 'a.pdf', VersionId: 'v1' },
          { Key: 'b.pdf', VersionId: 'v2' },
          { Key: 'c.pdf', VersionId: 'v3' },
        ],
        Quiet: true,
      },
    });
  });

  it('does not call DeleteObjects when the bucket is already empty', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({ IsTruncated: false });

    const s3Client = new S3Client({});
    const total = await truncateS3DocumentsBucket({ bucketName, s3Client });

    expect(total).toBe(0);
    expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(0);
  });

  it('skips entries without a Key', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      Versions: [{ VersionId: 'orphan' }, { Key: 'real.pdf', VersionId: 'v1' }],
      IsTruncated: false,
    });
    s3Mock.on(DeleteObjectsCommand).resolves({});

    const s3Client = new S3Client({});
    const total = await truncateS3DocumentsBucket({ bucketName, s3Client });

    expect(total).toBe(1);
    const deleteCalls = s3Mock.commandCalls(DeleteObjectsCommand);
    expect(deleteCalls[0].args[0].input.Delete?.Objects).toEqual([
      { Key: 'real.pdf', VersionId: 'v1' },
    ]);
  });
});

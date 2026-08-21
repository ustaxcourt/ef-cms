import {
  DeleteObjectsCommand,
  ListBucketsCommand,
  ListObjectVersionsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { truncateAllEnvironmentS3Buckets } from './truncate-all-s3-buckets.helpers';

const s3Mock = mockClient(S3Client);

describe('truncateAllEnvironmentS3Buckets', () => {
  const environmentName = 'test-env';
  const bucketName = `efcms-documents-${environmentName}`;

  beforeEach(() => {
    s3Mock.reset();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    s3Mock.on(ListBucketsCommand).resolves({
      Buckets: [{ Name: bucketName }, { Name: 'unrelated-bucket' }],
    });
  });

  it('paginates ListObjectVersions and deletes versions and delete-markers for matched buckets', async () => {
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

    s3Mock
      .on(DeleteObjectsCommand)
      .resolvesOnce({
        Deleted: [
          { Key: 'a.pdf', VersionId: 'v1' },
          { Key: 'b.pdf', VersionId: 'v2' },
          { Key: 'c.pdf', VersionId: 'v3' },
        ],
      })
      .resolvesOnce({
        Deleted: [{ Key: 'd.pdf', VersionId: 'v4' }],
      });

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({ [bucketName]: 4 });
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
        Quiet: false,
      },
    });
  });

  it('does not call DeleteObjects when the bucket is already empty', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({ IsTruncated: false });

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({ [bucketName]: 0 });
    expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(0);
  });

  it('handles if ListBucketsCommand returns no buckets', async () => {
    s3Mock.on(ListBucketsCommand).resolves({});

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({});
    expect(s3Mock.commandCalls(ListObjectVersionsCommand)).toHaveLength(0);
  });

  it('skips buckets without a Name', async () => {
    s3Mock.on(ListBucketsCommand).resolves({
      Buckets: [{ Name: bucketName }, {}], // Last bucket has no Name
    });

    s3Mock.on(ListObjectVersionsCommand).resolves({ IsTruncated: false });

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({ [bucketName]: 0 });
    expect(s3Mock.commandCalls(ListObjectVersionsCommand)).toHaveLength(1);
  });

  it('skips entries without a Key', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      Versions: [{ VersionId: 'orphan' }, { Key: 'real.pdf', VersionId: 'v1' }],
      IsTruncated: false,
    });
    s3Mock
      .on(DeleteObjectsCommand)
      .resolves({ Deleted: [{ Key: 'real.pdf', VersionId: 'v1' }] });

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({ [bucketName]: 1 });
    const deleteCalls = s3Mock.commandCalls(DeleteObjectsCommand);
    expect(deleteCalls[0].args[0].input.Delete?.Objects).toEqual([
      { Key: 'real.pdf', VersionId: 'v1' },
    ]);
  });

  it('counts zero when DeleteObjects response omits Deleted', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      Versions: [{ Key: 'a.pdf', VersionId: 'v1' }],
      IsTruncated: false,
    });
    s3Mock.on(DeleteObjectsCommand).resolves({});

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({ [bucketName]: 0 });
  });

  it('throws when DeleteObjects returns errors', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      Versions: [{ Key: 'a.pdf', VersionId: 'v1' }],
      IsTruncated: false,
    });
    s3Mock.on(DeleteObjectsCommand).resolves({
      Deleted: [],
      Errors: [
        {
          Key: 'a.pdf',
          VersionId: 'v1',
          Code: 'AccessDenied',
          Message: 'nope',
        },
        {},
      ],
    });

    const s3Client = new S3Client({});

    await expect(
      truncateAllEnvironmentS3Buckets({ environmentName, s3Client }),
    ).rejects.toThrow(
      `Failed to delete one or more S3 object(s) from bucket ${bucketName}: a.pdf (v1): AccessDenied - nope, unknown-key: UnknownError`,
    );
  });

  it('continues paginating when IsTruncated is true even with empty markers', async () => {
    s3Mock
      .on(ListObjectVersionsCommand)
      .resolvesOnce({
        Versions: [{ Key: 'a.pdf', VersionId: 'v1' }],
        IsTruncated: true,
        NextKeyMarker: '',
        NextVersionIdMarker: '',
      })
      .resolvesOnce({
        Versions: [{ Key: 'b.pdf', VersionId: 'v2' }],
        IsTruncated: false,
      });

    s3Mock
      .on(DeleteObjectsCommand)
      .resolvesOnce({ Deleted: [{ Key: 'a.pdf', VersionId: 'v1' }] })
      .resolvesOnce({ Deleted: [{ Key: 'b.pdf', VersionId: 'v2' }] });

    const s3Client = new S3Client({});
    const total = await truncateAllEnvironmentS3Buckets({
      environmentName,
      s3Client,
    });

    expect(total).toEqual({ [bucketName]: 2 });
    expect(s3Mock.commandCalls(ListObjectVersionsCommand)).toHaveLength(2);
  });
});

/*
 * @jest-environment node
 */
import {
  DescribeDomainCommand,
  OpenSearchClient,
} from '@aws-sdk/client-opensearch';
import {
  checkIfEmpty,
  checkIfExists,
  deleteIfExists,
  readyClusterForMigration,
} from './ready-cluster-for-migration';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import { mockClient } from 'aws-sdk-client-mock';

describe('deleteIfExists', () => {
  let mockedStatusCode: number = 200;
  let mockedClient;

  beforeAll(() => {
    mockedClient = {
      indices: {
        delete: jest.fn(),
        exists: jest
          .fn()
          .mockImplementation(() => ({ statusCode: mockedStatusCode })),
      },
    };
  });

  beforeEach(() => {
    mockedStatusCode = 200;
  });

  it('checks to see if the index exists', async () => {
    await deleteIfExists({ client: mockedClient, index: 'double-foo' });

    expect(mockedClient.indices.exists).toHaveBeenCalledWith({
      body: {},
      index: 'double-foo',
    });
  });

  it('deletes the index if it exists', async () => {
    mockedStatusCode = 200;
    await deleteIfExists({ client: mockedClient, index: 'double-foo' });

    expect(mockedClient.indices.delete).toHaveBeenCalledWith({
      body: {},
      index: 'double-foo',
    });
  });

  it('does not attempt to delete the index if it does not exist', async () => {
    mockedStatusCode = 404;
    await deleteIfExists({ client: mockedClient, index: 'double-foo' });
    expect(mockedClient.indices.delete).not.toHaveBeenCalled();
  });
});

describe('checkIfExists', () => {
  const mockedDomainName = 'foo';
  const opensearchMock = mockClient(OpenSearchClient);

  beforeEach(() => {
    opensearchMock.reset();
  });

  it('returns true if the domain name exists', async () => {
    opensearchMock.on(DescribeDomainCommand).resolves({});
    const result = await checkIfExists(mockedDomainName);
    expect(result).toBe(true);
  });

  it('returns false if the domain does not exist', async () => {
    opensearchMock.on(DescribeDomainCommand).rejects({
      Code: 'ResourceNotFoundException',
    });
    const result = await checkIfExists(mockedDomainName);
    expect(result).toBe(false);
  });
});

describe('checkIfEmpty', () => {
  let mockedClient;
  let mockedCount;

  beforeEach(() => {
    mockedCount = 0;
    mockedClient = {
      count: jest.fn().mockImplementation(() => ({
        body: {
          count: mockedCount,
        },
      })),
    };
  });

  it('returns true if the domain is empty', async () => {
    mockedCount = 0;
    const result = await checkIfEmpty(mockedClient);
    expect(result).toBe(true);
  });

  it('returns false if the domain is not empty', async () => {
    mockedCount = 1;
    const result = await checkIfEmpty(mockedClient);
    expect(result).toBe(false);
  });
});

describe('readyClusterForMigration', () => {
  let mockedClient;
  let mockedCount = 0;
  let mockedStatusCode = 200;
  let mockedExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: number | undefined): never => {
      throw new Error('process.exit: ' + code);
    });

  beforeAll(() => {
    mockedClient = {
      count: jest.fn().mockImplementation(() => ({
        body: {
          count: mockedCount,
        },
      })),
      indices: {
        delete: jest.fn(),
        exists: jest
          .fn()
          .mockImplementation(() => ({ statusCode: mockedStatusCode })),
      },
    };
  });

  it('checks to see if the cluster is empty', async () => {
    await readyClusterForMigration(mockedClient);
    expect(mockedClient.count).toHaveBeenCalled();
  });

  describe('cluster is not empty', () => {
    beforeAll(() => {
      mockedCount = 5;
    });

    it('exits with a statusCode of 1', async () => {
      await expect(readyClusterForMigration(mockedClient)).rejects.toThrow();
      expect(mockedExit).toHaveBeenCalledWith(1);
    });
  });

  describe('cluster is empty', () => {
    beforeAll(() => {
      mockedCount = 0;
    });

    it.each(elasticsearchIndexes)(
      'checks if each index exists and deletes it',
      async index => {
        await readyClusterForMigration(mockedClient);
        expect(mockedClient.indices.exists).toHaveBeenCalledWith({
          body: {},
          index,
        });
        expect(mockedClient.indices.exists).toHaveBeenCalledWith({
          body: {},
          index,
        });
      },
    );
  });
});

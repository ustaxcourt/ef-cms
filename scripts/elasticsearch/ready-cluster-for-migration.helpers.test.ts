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
} from './ready-cluster-for-migration.helpers';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import { mockClient } from 'aws-sdk-client-mock';

let mockedStatusCode: number = 200;
let mockedCount: number = 0;
const mockedClient = {
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
jest.mock('../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn().mockImplementation(() => mockedClient),
}));

const mockedOpenSearch = mockClient(OpenSearchClient);
const mockedExit = jest
  .spyOn(process, 'exit')
  .mockImplementation((code?: number | undefined): never => {
    throw new Error('process.exit: ' + code);
  });

describe('deleteIfExists', () => {
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

  beforeEach(() => {
    mockedOpenSearch.reset();
  });

  it('returns true if the domain name exists', async () => {
    mockedOpenSearch.on(DescribeDomainCommand).resolves({});
    const result = await checkIfExists(mockedDomainName);
    expect(result).toBe(true);
  });

  it('returns false if the domain does not exist', async () => {
    mockedOpenSearch.on(DescribeDomainCommand).rejects({
      Code: 'ResourceNotFoundException',
    });
    const result = await checkIfExists(mockedDomainName);
    expect(result).toBe(false);
  });

  it('throws an error if the describe domain command rejects with an error other than ResourceNotFoundException', async () => {
    mockedOpenSearch.on(DescribeDomainCommand).rejects({
      Code: 'InternalException',
    });
    await expect(checkIfExists(mockedDomainName)).rejects.toThrow();
  });
});

describe('checkIfEmpty', () => {
  beforeEach(() => {
    mockedCount = 0;
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
  let mockedDomainName = 'efcms-search-foo-bar';

  beforeEach(() => {
    mockedOpenSearch.reset();
    // mockedOpenSearch.on(DescribeDomainCommand).resolves({});
  });

  it('does not check to see if the cluster is empty if an invalid DomainName is passed in', async () => {
    await readyClusterForMigration('invalid-name');
    expect(mockedClient.count).not.toHaveBeenCalled();
  });

  it('does not check to see if the cluster is empty if an invalid DomainName is passed in', async () => {
    await readyClusterForMigration('');
    expect(mockedOpenSearch.commandCalls(DescribeDomainCommand).length).toBe(0);
    expect(mockedClient.count).not.toHaveBeenCalled();
  });

  it('does not check to see if the cluster is empty if it does not exist', async () => {
    mockedOpenSearch.reset();
    mockedOpenSearch.on(DescribeDomainCommand).rejects({
      Code: 'ResourceNotFoundException',
    });
    await readyClusterForMigration(mockedDomainName);
    expect(mockedClient.count).not.toHaveBeenCalled();
  });

  it('checks to see if the cluster is empty', async () => {
    mockedCount = 0;
    await readyClusterForMigration(mockedDomainName);
    expect(mockedClient.count).toHaveBeenCalled();
  });

  describe('cluster is not empty', () => {
    beforeAll(() => {
      mockedCount = 5;
    });

    it('exits with a statusCode of 1', async () => {
      await expect(
        readyClusterForMigration(mockedDomainName),
      ).rejects.toThrow();
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
        await readyClusterForMigration(mockedDomainName);
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

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
  readyClusterForMigration,
} from './ready-cluster-for-migration.helpers';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import { getBaseAliasFromIndexName } from '../../web-api/elasticsearch/elasticsearch-aliases';
import { mockClient } from 'aws-sdk-client-mock';

let mockedStatusCode: number = 200;
let mockedCount: number = 0;
const aliases = jest
  .fn()
  .mockImplementation(() => ({ body: [], statusCode: 200 }));
const indices = jest
  .fn()
  .mockImplementation(() => ({ body: [], statusCode: 200 }));
const mockedClient = {
  cat: {
    aliases,
    indices,
  },
  count: jest.fn().mockImplementation(() => ({
    body: {
      count: mockedCount,
    },
  })),
  indices: {
    delete: jest.fn(),
    deleteAlias: jest.fn().mockReturnValue({ statusCode: 200 }),
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

    it('does not delete aliases if none exist', async () => {
      await readyClusterForMigration(mockedDomainName);
      expect(mockedClient.indices.deleteAlias).not.toHaveBeenCalled();
    });

    it("lists the cluster's aliases and deletes them", async () => {
      const mockAliases = elasticsearchIndexes.map(index => {
        return {
          alias: getBaseAliasFromIndexName(index),
          index,
        };
      });
      aliases.mockReturnValueOnce({ body: mockAliases, statusCode: 200 });

      await readyClusterForMigration(mockedDomainName);
      expect(mockedClient.indices.deleteAlias).toHaveBeenCalledTimes(
        mockAliases.length,
      );
    });

    it('does not delete indices if none exist', async () => {
      await readyClusterForMigration(mockedDomainName);
      expect(mockedClient.indices.delete).not.toHaveBeenCalled();
    });

    it("lists the cluster's indices and deletes them", async () => {
      aliases.mockReturnValueOnce({ body: [], statusCode: 200 });
      const mockIndices = elasticsearchIndexes.map(index => {
        return { index };
      });
      indices.mockReturnValueOnce({ body: mockIndices, statusCode: 200 });

      await readyClusterForMigration(mockedDomainName);
      expect(mockedClient.indices.delete).toHaveBeenCalledTimes(
        mockIndices.length,
      );
    });
  });
});

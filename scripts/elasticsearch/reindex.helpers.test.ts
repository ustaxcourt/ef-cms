import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import { getBaseAliasFromIndexName } from '../../web-api/elasticsearch/elasticsearch-aliases';
import { mockDifferentExistingMappings } from './reindex.helpers.test.helpers';
import { reindexIfNecessary } from './reindex.helpers';

const mockAliases = elasticsearchIndexes.map(index => {
  return {
    alias: getBaseAliasFromIndexName(index),
    index,
  };
});
const aliases = jest.fn();
const mockedClient = {
  cat: {
    aliases,
  },
  reindex: jest.fn().mockReturnValue({ statusCode: 200 }),
} as unknown as Client;
jest.mock('../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn().mockReturnValue(mockedClient),
}));

describe('reindexIfNecessary', () => {
  it('retrieves a list of existing aliases', async () => {
    aliases.mockReturnValueOnce({
      body: mockAliases,
      statusCode: 200,
    });

    await reindexIfNecessary({ client: mockedClient });
    expect(mockedClient.cat.aliases).toHaveBeenCalledWith({ format: 'json' });
  });

  it("does NOT reindex indices if the mappings haven't changed", async () => {
    aliases.mockReturnValueOnce({
      body: mockAliases,
      statusCode: 200,
    });

    await reindexIfNecessary({ client: mockedClient });
    expect(mockedClient.reindex).not.toHaveBeenCalled();
  });

  it('reindexes indices if the mappings have changed', async () => {
    const {
      existingAliases,
      existingCaseIndexName,
      existingDocketEntryIndexName,
      newCaseIndexName,
      newDocketEntryIndexName,
    } = mockDifferentExistingMappings();

    aliases.mockReturnValueOnce({
      body: existingAliases,
      statusCode: 200,
    });

    await reindexIfNecessary({ client: mockedClient });
    expect(mockedClient.reindex).toHaveBeenCalledTimes(2);
    expect(mockedClient.reindex).toHaveBeenNthCalledWith(1, {
      body: {
        dest: {
          index: newCaseIndexName,
        },
        source: {
          index: existingCaseIndexName,
        },
      },
      wait_for_completion: false,
    });
    expect(mockedClient.reindex).toHaveBeenNthCalledWith(2, {
      body: {
        dest: {
          index: newDocketEntryIndexName,
        },
        source: {
          index: existingDocketEntryIndexName,
        },
      },
      wait_for_completion: false,
    });
  });
});

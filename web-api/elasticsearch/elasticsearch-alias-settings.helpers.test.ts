import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { getBaseAliasFromIndexName } from './elasticsearch-aliases';
import { mockDifferentExistingMappings } from '../../scripts/elasticsearch/reindex.helpers.test.helpers';
import { setupAliases } from './elasticsearch-alias-settings.helpers';

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
  indices: {
    deleteAlias: jest.fn().mockReturnValue({ statusCode: 200 }),
    putAlias: jest.fn().mockReturnValue({ statusCode: 200 }),
  },
} as unknown as Client;
jest.mock('../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn().mockReturnValue(mockedClient),
}));

describe('setupAliases', () => {
  it('retrieves a list of existing aliases', async () => {
    aliases.mockReturnValueOnce({
      body: mockAliases,
      statusCode: 200,
    });

    await setupAliases({ client: mockedClient });
    expect(mockedClient.cat.aliases).toHaveBeenCalledWith({ format: 'json' });
  });

  it('does NOT modify aliases if they are already pointing to the latest indices', async () => {
    aliases.mockReturnValueOnce({
      body: mockAliases,
      statusCode: 200,
    });

    await setupAliases({ client: mockedClient });
    expect(mockedClient.indices.deleteAlias).not.toHaveBeenCalled();
    expect(mockedClient.indices.putAlias).not.toHaveBeenCalled();
  });

  it('modifies aliases if they are not already pointing to the latest indices', async () => {
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

    await setupAliases({ client: mockedClient });
    expect(mockedClient.indices.deleteAlias).toHaveBeenCalledTimes(2);
    expect(mockedClient.indices.putAlias).toHaveBeenCalledTimes(2);
    expect(mockedClient.indices.deleteAlias).toHaveBeenNthCalledWith(1, {
      index: existingCaseIndexName,
      name: 'efcms-case',
    });
    expect(mockedClient.indices.putAlias).toHaveBeenNthCalledWith(1, {
      index: newCaseIndexName,
      name: 'efcms-case',
    });
    expect(mockedClient.indices.deleteAlias).toHaveBeenNthCalledWith(2, {
      index: existingDocketEntryIndexName,
      name: 'efcms-docket-entry',
    });
    expect(mockedClient.indices.putAlias).toHaveBeenNthCalledWith(2, {
      index: newDocketEntryIndexName,
      name: 'efcms-docket-entry',
    });
  });
});

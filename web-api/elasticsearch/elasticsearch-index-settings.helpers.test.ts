import { Client } from '@opensearch-project/opensearch';
import { createHash } from 'crypto';
import {
  deleteUnaliasedIndices,
  setupIndexes,
} from './elasticsearch-index-settings.helpers';
import { elasticsearchIndexes, esIndexType } from './elasticsearch-indexes';
import { getBaseAliasFromIndexName } from './elasticsearch-aliases';

const mockAliases = elasticsearchIndexes.map(index => {
  return {
    alias: getBaseAliasFromIndexName(index),
    index,
  };
});
const aliases = jest.fn();
const exists = jest.fn();
const indices = jest.fn();
const mockedClient = {
  cat: {
    aliases,
    indices,
  },
  indices: {
    create: jest.fn().mockReturnValue({ statusCode: 200 }),
    delete: jest.fn().mockReturnValue({ statusCode: 200 }),
    exists,
    putSettings: jest.fn().mockReturnValue({ statusCode: 200 }),
  },
} as unknown as Client;
const mockEnvName = 'experimental100';
jest.mock('../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn().mockReturnValue(mockedClient),
}));

describe('setupIndexes', () => {
  it('does NOT create new indices if they already exist', async () => {
    for (const index of elasticsearchIndexes) {
      exists.mockReturnValueOnce({
        body: { index },
        statusCode: 200,
      });
    }

    await setupIndexes({ client: mockedClient, environmentName: mockEnvName });
    expect(mockedClient.indices.exists).toHaveBeenCalledTimes(
      elasticsearchIndexes.length,
    );
    expect(mockedClient.indices.create).not.toHaveBeenCalled();
    expect(mockedClient.indices.putSettings).toHaveBeenCalledTimes(
      elasticsearchIndexes.length,
    );
  });

  it('creates indices that do not exist already', async () => {
    for (const index of elasticsearchIndexes) {
      if (index.includes('docket-entry')) {
        exists.mockReturnValueOnce({
          statusCode: 404,
        });
      } else {
        exists.mockReturnValueOnce({
          body: { index },
          statusCode: 200,
        });
      }
    }

    await setupIndexes({ client: mockedClient, environmentName: mockEnvName });
    expect(mockedClient.indices.exists).toHaveBeenCalledTimes(
      elasticsearchIndexes.length,
    );
    expect(mockedClient.indices.create).toHaveBeenCalledTimes(1);
    expect(mockedClient.indices.putSettings).toHaveBeenCalledTimes(
      elasticsearchIndexes.length - 1,
    );
  });
});

describe('deleteUnaliasedIndices', () => {
  const mockIndices: esIndexType[] = [{ index: '.kibana1' }];
  const mockUnaliasedIndices: string[] = [];
  for (const index of elasticsearchIndexes) {
    const baseAlias = getBaseAliasFromIndexName(index);
    const someHash: string = createHash('md5')
      .update(JSON.stringify(baseAlias), 'utf-8')
      .digest('hex');
    const unaliasedIndex = `${baseAlias}-${someHash}`;
    mockIndices.push({ index });
    mockIndices.push({ index: unaliasedIndex });
    mockUnaliasedIndices.push(unaliasedIndex);
  }
  indices.mockReturnValue({ body: mockIndices, statusCode: 200 });
  aliases.mockReturnValue({ body: mockAliases, statusCode: 200 });

  it('retrieves a list of existing indices', async () => {
    await deleteUnaliasedIndices({ client: mockedClient });
    expect(mockedClient.cat.indices).toHaveBeenCalledTimes(1);
  });

  it('retrieves a list of existing aliases', async () => {
    await deleteUnaliasedIndices({ client: mockedClient });
    expect(mockedClient.cat.aliases).toHaveBeenCalledTimes(1);
  });

  it('deletes unaliased indices whose names contain "efcms"', async () => {
    await deleteUnaliasedIndices({ client: mockedClient });
    expect(mockedClient.indices.delete).toHaveBeenCalledTimes(1);
    expect(mockedClient.indices.delete).toHaveBeenCalledWith({
      index: mockUnaliasedIndices,
    });
  });
});

import { setupAliases } from '../../web-api/elasticsearch/elasticsearch-alias-settings.helpers';
import { setupIndexes } from '../../web-api/elasticsearch/elasticsearch-index-settings.helpers';
import { truncateAllOpenSearchIndices } from './truncate-opensearch.helpers';

jest.mock('../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn(),
}));
jest.mock(
  '../../web-api/elasticsearch/elasticsearch-index-settings.helpers',
  () => ({
    setupIndexes: jest.fn(),
  }),
);
jest.mock(
  '../../web-api/elasticsearch/elasticsearch-alias-settings.helpers',
  () => ({
    setupAliases: jest.fn(),
  }),
);
jest.mock('../../web-api/elasticsearch/elasticsearch-mappings', () => ({
  elasticsearchMappings: {
    'efcms-case': {},
    'efcms-docket-entry': {},
    'efcms-user': {},
  },
}));

const setupIndexesMock = jest.mocked(setupIndexes);
const setupAliasesMock = jest.mocked(setupAliases);

describe('truncateAllOpenSearchIndices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const buildClient = (existingIndices: string[]) => {
    const deleteCalls: { index: string }[] = [];
    return {
      client: {
        indices: {
          exists: jest
            .fn()
            .mockImplementation(({ index }: { index: string }) =>
              Promise.resolve({ body: existingIndices.includes(index) }),
            ),
          delete: jest.fn().mockImplementation(({ index }) => {
            deleteCalls.push({ index });
            return Promise.resolve({});
          }),
        },
      } as any,
      deleteCalls,
    };
  };

  it('deletes every existing index defined in mappings, then recreates indexes and aliases', async () => {
    const { client, deleteCalls } = buildClient(['efcms-case', 'efcms-user']);

    const result = await truncateAllOpenSearchIndices({
      elasticsearchEndpoint: 'http://localhost:9200',
      environmentName: 'local',
      client,
    });

    expect(result.deleted.sort()).toEqual(['efcms-case', 'efcms-user']);
    expect(deleteCalls.map(c => c.index).sort()).toEqual([
      'efcms-case',
      'efcms-user',
    ]);
    expect(setupIndexesMock).toHaveBeenCalledWith({
      client,
      environmentName: 'local',
    });
    expect(setupAliasesMock).toHaveBeenCalledWith({ client });
  });

  it('skips indices that do not yet exist', async () => {
    const { client, deleteCalls } = buildClient([]);

    const result = await truncateAllOpenSearchIndices({
      elasticsearchEndpoint: 'http://localhost:9200',
      environmentName: 'local',
      client,
    });

    expect(result.deleted).toEqual([]);
    expect(deleteCalls).toHaveLength(0);
    expect(setupIndexesMock).toHaveBeenCalled();
    expect(setupAliasesMock).toHaveBeenCalled();
  });

  it('rethrows when index deletion fails', async () => {
    const failingClient = {
      indices: {
        exists: jest.fn().mockResolvedValue({ body: true }),
        delete: jest.fn().mockRejectedValue(new Error('boom')),
      },
    } as any;

    await expect(
      truncateAllOpenSearchIndices({
        elasticsearchEndpoint: 'http://localhost:9200',
        environmentName: 'local',
        client: failingClient,
      }),
    ).rejects.toThrow('boom');
  });

  it('builds an OpenSearch client when one is not supplied', async () => {
    const { getClient } = require('../../web-api/elasticsearch/client');
    const { client } = buildClient([]);
    getClient.mockResolvedValue(client);

    await truncateAllOpenSearchIndices({
      elasticsearchEndpoint: 'http://localhost:9200',
      environmentName: 'local',
    });

    expect(getClient).toHaveBeenCalledWith({
      elasticsearchEndpoint: 'http://localhost:9200',
      environmentName: 'local',
    });
  });
});

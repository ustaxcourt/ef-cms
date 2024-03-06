import * as elasticsearchClient from '../../web-api/elasticsearch/client';
import * as elasticsearchIndexSettingsHelpers from '../../web-api/elasticsearch/elasticsearch-index-settings.helpers';
import * as reindexHelpers from './reindex.helpers';
import { createNewIndicesFromLocalMappings } from './create-temporary-indices-helpers';
import type { Client } from '@opensearch-project/opensearch';

const mockedClient = {} as Client;
jest.mock('../../web-api/elasticsearch/client');
const getClient = jest
  .spyOn(elasticsearchClient, 'getClient')
  .mockReturnValue(Promise.resolve(mockedClient));

jest.mock('../../web-api/elasticsearch/elasticsearch-index-settings.helpers');
const setupIndexes = jest
  .spyOn(elasticsearchIndexSettingsHelpers, 'setupIndexes')
  .mockImplementation(jest.fn());

jest.mock('./reindex.helpers');
const reindexIfNecessary = jest
  .spyOn(reindexHelpers, 'reindexIfNecessary')
  .mockImplementation(jest.fn());
const waitForReindexTasksToComplete = jest
  .spyOn(reindexHelpers, 'waitForReindexTasksToComplete')
  .mockImplementation(jest.fn());

describe('create-temporary-indices', () => {
  beforeEach(() => {
    process.env.ENV = 'jest';
  });

  it('exits if reindexing throws an error', async () => {
    reindexIfNecessary.mockRejectedValueOnce(new Error('some error'));
    const mockExit = jest.spyOn(process, 'exit').mockImplementation();

    await createNewIndicesFromLocalMappings({
      environmentName: process.env.ENV!,
    });

    expect(getClient).toHaveBeenCalledWith({ environmentName: 'jest' });
    expect(setupIndexes).toHaveBeenCalledWith({
      client: mockedClient,
      environmentName: 'jest',
    });
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('creates new indices and waits for reindexing to complete', async () => {
    await createNewIndicesFromLocalMappings({
      environmentName: process.env.ENV!,
    });

    expect(getClient).toHaveBeenCalledWith({ environmentName: 'jest' });
    expect(setupIndexes).toHaveBeenCalledWith({
      client: mockedClient,
      environmentName: 'jest',
    });
    expect(waitForReindexTasksToComplete).toHaveBeenCalledWith({
      environmentName: 'jest',
    });
  });
});

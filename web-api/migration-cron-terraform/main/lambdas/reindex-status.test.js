const { handler } = require('./reindex-status');

describe('reindex-status', () => {
  let esClient;
  const mockEnvironment = 'testEnv';
  let mockIsReindexFinished = jest.fn();
  const mockNeedsMigration = 'false';

  beforeEach(() => {
    esClient = {
      query: jest.fn().mockReturnValueOnce({}),
    };
  });

  it('should return 200 if needsMigration is false', async () => {});
  it('should return 200 if needsMigration is true and isReindexFinished is complete', async () => {});

  it('should return 200 if isReindexFinished is complete', async () => {});
});

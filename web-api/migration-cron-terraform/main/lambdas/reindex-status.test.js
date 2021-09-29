const {
  isReindexComplete,
} = require('../../../../shared/admin-tools/elasticsearch/check-reindex-complete');
const { handler } = require('./reindex-status');
jest.mock(
  '../../../../shared/admin-tools/elasticsearch/check-reindex-complete',
  () => ({
    isReindexComplete: jest.fn(),
  }),
);
jest.mock('axios');

const applicationContext = require('../../../src/applicationContext');
const axios = require('axios');

describe('reindex-status', () => {
  const mockJobs = [];
  let mockEnvironment = {
    CIRCLE_MACHINE_USER_TOKEN: '7806d03d-075d-46a3-a5fc-5d0e439f5d8e',
    CIRCLE_WORKFLOW_ID: '7806d03d-075d-46a3-a5fc-5d0e439f5d8e',
    MIGRATE_FLAG: 'false',
  };

  beforeEach(() => {
    applicationContext.logger = jest.fn();
    //mock env vars
    process.env = mockEnvironment;
    isReindexComplete.mockReturnValueOnce(true);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { items: [mockJobs] } }),
    );
  });

  it('should return 200 if needsMigration is false', async () => {
    const result = await handler();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(200);
  });

  it('should return 200 if needsMigration is true and isReindexFinished is complete', async () => {});
  it('should not make get and post requests when needsMigration is true and isReindexFinished is not complete', async () => {});

  // it('should return 200 if isReindexFinished is complete', async () => {});
});

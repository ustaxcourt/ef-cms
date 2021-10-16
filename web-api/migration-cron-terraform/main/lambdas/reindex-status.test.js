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

const axios = require('axios');

describe('reindex-status', () => {
  const mockJobs = [{}, { approval_request_id: 'MOCK_APPROVAL_REQUEST_ID' }];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make get and post requests if needsMigration is false and isReindexFinished is true', async () => {
    process.env.MIGRATE_FLAG = false;
    isReindexComplete.mockReturnValueOnce(true);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { items: mockJobs } }),
    );

    await handler();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should make get and post requests if needsMigration is true and isReindexFinished is true', async () => {
    process.env.MIGRATE_FLAG = true;
    isReindexComplete.mockReturnValueOnce(true);

    await handler();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should not make get and post requests when needsMigration is true and isReindexFinished is false', async () => {
    process.env.MIGRATE_FLAG = true;
    isReindexComplete.mockReturnValueOnce(false);

    await handler();
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

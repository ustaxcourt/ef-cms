const {
  areAllReindexTasksFinished,
} = require('../../../../../shared/admin-tools/elasticsearch/check-reindex-complete');
const { handler } = require('./reindex-status');
jest.mock(
  '../../../../../shared/admin-tools/elasticsearch/check-reindex-complete',
  () => ({
    areAllReindexTasksFinished: jest.fn(),
    isMigratedClusterFinishedIndexing: jest.fn(),
  }),
);
jest.mock('axios');

const axios = require('axios');

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
};

describe('reindex-status', () => {
  const mockJobs = [
    {},
    {
      approval_request_id: 'MOCK_APPROVAL_REQUEST_ID',
      name: 'wait-for-reindex',
    },
  ];

  console.log = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make get and post requests when MIGRATE_FLAG is false and areAllReindexTasksFinished returns true', async () => {
    process.env.MIGRATE_FLAG = 'false';
    areAllReindexTasksFinished.mockReturnValue(true);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { items: mockJobs } }),
    );

    await handler({}, mockContext);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should NOT make get and post requests when MIGRATE_FLAG is true and areAllReindexTasksFinished returns false', async () => {
    process.env.MIGRATE_FLAG = 'false';
    areAllReindexTasksFinished.mockReturnValue(false);

    await handler({}, mockContext);
    expect(areAllReindexTasksFinished).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it('should NOT make get and post requests when MIGRATE_FLAG is true', async () => {
    process.env.MIGRATE_FLAG = 'true';

    await handler({}, mockContext);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

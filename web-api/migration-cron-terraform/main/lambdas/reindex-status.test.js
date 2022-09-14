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

  console.log = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make get and post requests when MIGRATE_FLAG is false and REINDEX_FLAG is false', async () => {
    process.env.MIGRATE_FLAG = false;
    process.env.REINDEX_FLAG = false;
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { items: mockJobs } }),
    );

    await handler();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should make get and post requests when MIGRATE_FLAG is true and isReindexComplete returns true', async () => {
    process.env.MIGRATE_FLAG = true;
    process.env.REINDEX_FLAG = false;
    isReindexComplete.mockReturnValueOnce(true);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { items: mockJobs } }),
    );

    await handler();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should make get and post requests when REINDEX_FLAG is true and isReindexComplete returns true', async () => {
    process.env.MIGRATE_FLAG = false;
    process.env.REINDEX_FLAG = true;
    isReindexComplete.mockReturnValueOnce(true);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { items: mockJobs } }),
    );

    await handler();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should NOT make get and post requests when MIGRATE_FLAG is true and isReindexFinished returns false', async () => {
    process.env.MIGRATE_FLAG = true;
    process.env.REINDEX_FLAG = false;
    isReindexComplete.mockReturnValue(false);

    await handler();

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

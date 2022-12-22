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

  it('should make get and post requests when MIGRATE_FLAG is false', async () => {
    process.env.MIGRATE_FLAG = false;
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
    isReindexComplete.mockReturnValue(true);
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
    isReindexComplete.mockReturnValue(false);

    await handler();
    expect(isReindexComplete).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

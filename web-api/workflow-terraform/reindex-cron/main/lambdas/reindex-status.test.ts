import * as checkReindexComplete from '../../../../../shared/admin-tools/elasticsearch/check-reindex-complete';
import { handler } from './reindex-status';
import axios from 'axios';

jest.mock(
  '../../../../../shared/admin-tools/elasticsearch/check-reindex-complete',
);
const areAllReindexTasksFinished = jest
  .spyOn(checkReindexComplete, 'areAllReindexTasksFinished')
  .mockImplementation(jest.fn());

jest.mock('axios');
const axiosPost = jest.spyOn(axios, 'post').mockImplementation(jest.fn());
const axiosGet = jest.spyOn(axios, 'get').mockImplementation(jest.fn());

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
    areAllReindexTasksFinished.mockReturnValue(Promise.resolve(true));
    axiosPost.mockImplementation(() => Promise.resolve({ status: 200 }));
    axiosGet.mockImplementation(() =>
      Promise.resolve({ data: { items: mockJobs } }),
    );

    await handler({}, mockContext);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledTimes(1);
  });

  it('should NOT make get and post requests when MIGRATE_FLAG is true and areAllReindexTasksFinished returns false', async () => {
    process.env.MIGRATE_FLAG = 'false';
    areAllReindexTasksFinished.mockReturnValue(false);

    await handler({}, mockContext);
    expect(areAllReindexTasksFinished).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledTimes(0);
    expect(axiosPost).toHaveBeenCalledTimes(0);
  });

  it('should NOT make get and post requests when MIGRATE_FLAG is true', async () => {
    process.env.MIGRATE_FLAG = 'true';

    await handler({}, mockContext);
    expect(axiosGet).toHaveBeenCalledTimes(0);
    expect(axiosPost).toHaveBeenCalledTimes(0);
  });
});

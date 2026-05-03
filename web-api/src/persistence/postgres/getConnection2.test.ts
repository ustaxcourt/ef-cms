const mockGetAuthToken = jest.fn();
jest.mock('@aws-sdk/rds-signer', () => {
  class Signer {
    getAuthToken() {
      return mockGetAuthToken();
    }
  }
  return {
    Signer,
  };
});
jest.mock('pg', () => {
  class Pool {
    options = {};
    connect() {
      return { release() {} };
    }
  }
  return {
    Pool,
  };
});
import { getConnection } from '@web-api/persistence/postgres/getConnection';
import { environment } from '@web-api/environment';

describe('getConnection', () => {
  environment.stage = 'testing';
  it('should re-establish db connection after failure', async () => {
    mockGetAuthToken.mockRejectedValueOnce(new Error('Failed!'));
    mockGetAuthToken.mockRejectedValueOnce(new Error('Failed!'));
    mockGetAuthToken.mockRejectedValueOnce(new Error('Failed!'));
    await expect(() => getConnection({ cb: () => {} })).rejects.toThrow();

    mockGetAuthToken.mockResolvedValueOnce('12346789');
    await getConnection({ cb: () => {} });
  });
});

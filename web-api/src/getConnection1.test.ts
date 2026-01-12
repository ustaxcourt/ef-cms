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
import { getConnection } from '@web-api/getConnection';
import { environment } from '@web-api/environment';

describe('getConnection', () => {
  environment.stage = 'testing';
  it('should not establish multiple connections at the same time', async () => {
    mockGetAuthToken.mockResolvedValue('12346789');
    await Promise.all([
      getConnection({ cb: () => {} }),
      getConnection({ cb: () => {} }),
      getConnection({ cb: () => {} }),
    ]);
    expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
  });
});

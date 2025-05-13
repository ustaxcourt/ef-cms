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
import { getConnection } from '@web-api/getConnection';
import { environment } from '@web-api/environment';

describe('getConnection', () => {
  environment.nodeEnv = 'production';
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

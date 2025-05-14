const mockGetAuthToken = jest.fn();
jest.mock('@aws-sdk/rds-signer', () => {
  class Signer {
    getAuthToken() {
      mockGetAuthToken();
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
  test('should not establish multiple connections at the same time', async () => {
    await Promise.all([
      getConnection({ cb: () => {} }),
      getConnection({ cb: () => {} }),
      getConnection({ cb: () => {} }),
    ]);
    expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
  });
});

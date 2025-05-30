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
  environment.stage = 'prod';
  it('should re-establish db connection after failure', async () => {
    mockGetAuthToken.mockRejectedValueOnce(new Error('Failed!'));
    await expect(() => getConnection({ cb: () => {} })).rejects.toThrow();

    mockGetAuthToken.mockResolvedValueOnce('12346789');
    await getConnection({ cb: () => {} });
  });
});

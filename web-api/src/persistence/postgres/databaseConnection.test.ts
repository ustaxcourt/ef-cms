import { getDb, exportedForTesting } from './databaseConnection';
const { getToken } = exportedForTesting;
import { environment } from '@web-api/environment';

jest.doMock('@web-api/persistence/postgres/databaseConnection', () => ({
  getDbReader: cb => cb(fakeReader),
}));

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

const mockExecute = jest.fn().mockResolvedValue(undefined);
const fakeReader = { executeQuery: mockExecute };

describe('getDb', () => {
  it('should not establish multiple database pools at the same time', async () => {
    const [db1, db2, db3] = await Promise.all([getDb(), getDb(), getDb()]);

    expect(new Set([db1, db2, db3]).size).toBe(1);
  });
  it('should not generate multiple rds tokens at the same time', async () => {
    environment.nodeEnv = 'production';
    mockGetAuthToken.mockResolvedValue('12346789');
    await Promise.all([getToken(), getToken(), getToken()]);
    expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
  });
});

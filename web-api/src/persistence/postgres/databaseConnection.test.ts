import { getDb, exportedForTesting } from './databaseConnection';
import { environment } from '@web-api/environment';

const { getToken } = exportedForTesting;

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

describe('getDb', () => {
  const originalEnvStage = environment.stage;

  afterAll(() => {
    environment.stage = originalEnvStage;
  });

  it('should not establish multiple database pools at the same time', async () => {
    const [db1, db2, db3] = await Promise.all([getDb(), getDb(), getDb()]);

    expect(new Set([db1, db2, db3]).size).toBe(1);
  });
  it('should not generate multiple rds tokens at the same time', async () => {
    environment.stage = 'production';
    mockGetAuthToken.mockResolvedValue('12346789');
    await Promise.all([getToken(), getToken(), getToken()]);
    expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
  });
});

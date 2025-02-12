jest.mock('@web-api/utilities/logger/getLogger', () => {
  const mockLogger = {
    addContext: jest.fn(),
    addUser: jest.fn(),
    clearContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    getContext: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
  return { getLogger: () => mockLogger };
});
jest.mock('@web-api/persistence/dynamo/deployTable/getMaintenanceMode');
jest.mock('@web-api/business/getEntityByName');
import {
  checkMaintenanceMode,
  dataSecurityFilter,
  genericHandler,
} from './genericHandler';
import { getEntityByName as getEntityByNameMock } from '@web-api/business/getEntityByName';
import { getLogger as getLoggerMock } from '@web-api/utilities/logger/getLogger';
import { getMaintenanceMode as getMaintenanceModeMock } from '@web-api/persistence/dynamo/deployTable/getMaintenanceMode';
import {
  mockAdcUser,
  mockDocketClerkUser,
  mockIrsPractitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
const token =
  'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoic2dhcEEyWk1XcGxudnFaRHhGWUVzUSIsInN1YiI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfN3VSa0YwQXhuIiwiY29nbml0bzp1c2VybmFtZSI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImF1ZCI6IjZ0dTZqMXN0djV1Z2N1dDdkcXNxZHVybjhxIiwiZXZlbnRfaWQiOiIzMGIwYjJiMi0zMDY0LTExZTktOTk0Yi03NTIwMGE2ZTQ3YTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU1MDE1NDI0OCwibmFtZSI6IlRlc3QgUGV0aXRpb25lciIsImV4cCI6MTU1MDE1Nzg0OCwiY3VzdG9tOnJvbGUiOiJwZXRpdGlvbmVyIiwiaWF0IjoxNTUwMTU0MjQ4LCJlbWFpbCI6InBldGl0aW9uZXIxQGV4YW1wbGUuY29tIn0.KBEzAj84SV6Pulu9SEjGqbIPtL_iAeC-Tcc3fvphZ_nLHuIgN7LRv8pM-ClMM3Sua5YVQ7h70N1wRV0UZADxHiEDN5pYshcsjhZdnT9sWN9Nu5QT4l9e1zFsgu1S_p9M29i0__si674VT16hlXHCywrrqrofaJYZgMVXjvfEKYDmUo4XPCGN0GVFtt9sepxjAwd5rRIF9Ned3XGBQ2xrQd5qWlIMsvnhdlIL9FqvC47_ZsPh16IyREp7FDAEI5LxIkJOFE2Ryoe74cg_9nIaqP3rQsRrRMk7E_mQ9yGV4_2j4PEfoehm3wHbrGvhNFdDBDMosS3OfbUY411swAAh3Q';

const MOCK_EVENT = {
  headers: {
    authorization: `Bearer ${token}`,
  },
};

class MockEntity {
  private;
  public;
  constructor(raw, { filtered = false }) {
    if (!filtered) {
      this.private = raw.private;
    }
    this.public = raw.public;
  }
}

describe('genericHandler', () => {
  const getMaintenanceMode = jest.mocked(getMaintenanceModeMock);
  const getEntityByName = jest.mocked(getEntityByNameMock);
  beforeEach(() => {
    getMaintenanceMode.mockResolvedValue({ current: false });
    getEntityByName.mockReturnValue(MockEntity);
  });

  it('returns an error if the callback throws', async () => {
    const callback = () => {
      return Promise.reject(new Error('Test Error'));
    };

    const response = await genericHandler(MOCK_EVENT, callback);

    expect(response.statusCode).toEqual('400');
    expect(JSON.parse(response.body)).toEqual('Test Error');
    expect(getLoggerMock().error).toHaveBeenCalled();
  });

  it('defaults the options param to an empty object if not provided', async () => {
    const callback = () => null;

    await genericHandler({ ...MOCK_EVENT }, callback);

    expect(getLoggerMock().error).not.toHaveBeenCalled();
  });

  it('does not call application.logger.error if the skipLogging flag is present on the error', async () => {
    const callback = () => {
      const error = new Error('Test Error');
      error.skipLogging = true;
      throw error;
    };

    const response = await genericHandler({ ...MOCK_EVENT }, callback);

    expect(response.statusCode).toEqual('400');
    expect(JSON.parse(response.body)).toEqual('Test Error');
    expect(getLoggerMock().error).not.toHaveBeenCalled();
  });

  it('should log `request` and `results` by default', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback);

    expect(getLoggerMock().debug).toHaveBeenCalledWith(
      'Request:',
      expect.anything(),
    );
    expect(getLoggerMock().debug).toHaveBeenCalledWith(
      'Results:',
      expect.anything(),
    );
  });

  it('should not log `results` when disabled in options', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      logResults: false,
    });

    expect(getLoggerMock().debug).toHaveBeenCalledWith(
      'Request:',
      expect.anything(),
    );
    expect(getLoggerMock().debug).not.toHaveBeenCalledWith(
      'Results:',
      expect.anything(),
    );
  });

  it('returns the results of a successful execution', async () => {
    const callback = () => {
      return Promise.resolve('some data');
    };

    const result = await genericHandler(MOCK_EVENT, callback);

    expect(JSON.parse(result.body)).toEqual('some data');
  });

  it('returns the results of a successful execution and filters via entity constructor if the return data contains entityName', async () => {
    const callback = () => {
      return Promise.resolve({
        data: 'some data',
        entityName: 'Case',
        public: 'public data',
      });
    };

    const result = await genericHandler(MOCK_EVENT, callback);

    expect(JSON.parse(result.body)).toEqual({ public: 'public data' });
  });

  describe('dataSecurityFilter', () => {
    it('returns data as it was passed in if entityName is not present', () => {
      const data = {
        private: 'private',
        public: 'public',
      };
      const result = dataSecurityFilter(data, {
        authorizedUser: mockDocketClerkUser,
      });
      expect(result).toEqual(data);
    });

    it('returns data after passing through entity constructor if entityName is present', () => {
      const data = {
        entityName: 'MockEntity',
        private: 'private',
        public: 'public',
      };
      const result = dataSecurityFilter(data, {
        authorizedUser: mockIrsPractitionerUser,
      });
      expect(result).toEqual({
        public: 'public',
      });
    });

    it('returns data without passing through entity constructor if entityName is not present in getEntityConstructors', () => {
      getEntityByName.mockReturnValue(null);
      const data = {
        entityName: 'MockEntity2',
        private: 'private',
        public: 'public',
      };

      const result = dataSecurityFilter(data, {
        authorizedUser: mockAdcUser,
      });

      expect(result).toEqual({
        entityName: 'MockEntity2',
        private: 'private',
        public: 'public',
      });
    });

    it('returns array data after passing through entity constructor if entityName is present on array element', () => {
      const data = [
        {
          entityName: 'MockEntity',
          private: 'private',
          public: 'public',
        },
        {
          entityName: 'MockEntity',
          private: 'private',
          public: 'public',
        },
      ];

      const result = dataSecurityFilter(data, {
        authorizedUser: undefined,
      });

      expect(result).toEqual([{ public: 'public' }, { public: 'public' }]);
    });

    it('returns array data without passing through entity constructor if entityName is present on array element but entity cannot be retrieved by name', () => {
      getEntityByName.mockReturnValue(null);
      const data = [
        {
          entityName: 'MockEntity2',
          private: 'private',
          public: 'public',
        },
        {
          entityName: 'MockEntity2',
          private: 'private',
          public: 'public',
        },
      ];

      const result = dataSecurityFilter(data, {
        authorizedUser: mockPetitionsClerkUser,
      });

      expect(result).toEqual([
        {
          entityName: 'MockEntity2',
          private: 'private',
          public: 'public',
        },
        {
          entityName: 'MockEntity2',
          private: 'private',
          public: 'public',
        },
      ]);
    });
  });

  describe('checkMaintenanceMode', () => {
    it('should throw an error if maintenance mode is true', async () => {
      getMaintenanceMode.mockResolvedValue({ current: true });

      await expect(checkMaintenanceMode()).rejects.toThrow(
        'Maintenance mode is enabled',
      );
    });

    it('should not throw an error if maintenance mode is false', async () => {
      getMaintenanceMode.mockResolvedValue({ current: false });

      await expect(checkMaintenanceMode()).resolves.toBe(false);
    });

    it('should NOT throw an error if maintenance mode is undefined', async () => {
      getMaintenanceMode.mockResolvedValue(undefined);

      await expect(checkMaintenanceMode()).resolves.not.toThrow();
    });
  });
});

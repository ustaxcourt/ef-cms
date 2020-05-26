const {
  applicationContext,
} = require('../../shared/src/business/test/createTestApplicationContext');
const { dataSecurityFilter, genericHandler } = require('./genericHandler');

const token =
  'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoic2dhcEEyWk1XcGxudnFaRHhGWUVzUSIsInN1YiI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfN3VSa0YwQXhuIiwiY29nbml0bzp1c2VybmFtZSI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImF1ZCI6IjZ0dTZqMXN0djV1Z2N1dDdkcXNxZHVybjhxIiwiZXZlbnRfaWQiOiIzMGIwYjJiMi0zMDY0LTExZTktOTk0Yi03NTIwMGE2ZTQ3YTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU1MDE1NDI0OCwibmFtZSI6IlRlc3QgUGV0aXRpb25lciIsImV4cCI6MTU1MDE1Nzg0OCwiY3VzdG9tOnJvbGUiOiJwZXRpdGlvbmVyIiwiaWF0IjoxNTUwMTU0MjQ4LCJlbWFpbCI6InBldGl0aW9uZXIxQGV4YW1wbGUuY29tIn0.KBEzAj84SV6Pulu9SEjGqbIPtL_iAeC-Tcc3fvphZ_nLHuIgN7LRv8pM-ClMM3Sua5YVQ7h70N1wRV0UZADxHiEDN5pYshcsjhZdnT9sWN9Nu5QT4l9e1zFsgu1S_p9M29i0__si674VT16hlXHCywrrqrofaJYZgMVXjvfEKYDmUo4XPCGN0GVFtt9sepxjAwd5rRIF9Ned3XGBQ2xrQd5qWlIMsvnhdlIL9FqvC47_ZsPh16IyREp7FDAEI5LxIkJOFE2Ryoe74cg_9nIaqP3rQsRrRMk7E_mQ9yGV4_2j4PEfoehm3wHbrGvhNFdDBDMosS3OfbUY411swAAh3Q';

const MOCK_EVENT = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const MOCK_USER = {
  name: 'Test User',
  userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
};

let logged = [];
let lastLoggedValue;

// Suppress console output in test runner (RAE SAID THIS WOULD BE COOL)
console.error = () => null;
console.info = () => null;

/**
 * returns a mock entity object
 *
 * @param {object} raw the raw entity data to return
 * @param {object} options additional options for the returned mock entity
 */
function MockEntity(raw, { filtered = false }) {
  if (!filtered) {
    this.private = raw.private;
  }
  this.public = raw.public;
}

describe('genericHandler', () => {
  beforeEach(() => {
    lastLoggedValue = null;
    logged = [];

    applicationContext.logger.info.mockImplementation((label, value) => {
      logged.push(label);
      lastLoggedValue = value;
    });
    applicationContext.getEntityByName.mockImplementation(() => MockEntity);
  });

  it('returns an error if the callback throws', async () => {
    const callback = () => {
      return Promise.reject(new Error('Test Error'));
    };

    const response = await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
    });

    expect(response.statusCode).toEqual('400');
    expect(JSON.parse(response.body)).toEqual('Test Error');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.notifyHoneybadger).toHaveBeenCalled();
  });

  it('defaults the options param to an empty object if not provided', async () => {
    const callback = () => null;

    await genericHandler({ ...MOCK_EVENT }, callback);

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });

  it('does not call application.logger.error if the skipLogging flag is present on the error', async () => {
    const callback = () => {
      const error = new Error('Test Error');
      error.skipLogging = true;
      throw error;
    };

    const response = await genericHandler({ ...MOCK_EVENT }, callback, {
      applicationContext,
    });

    expect(response.statusCode).toEqual('400');
    expect(JSON.parse(response.body)).toEqual('Test Error');
    expect(applicationContext.logger.error).not.toHaveBeenCalled();
    expect(applicationContext.notifyHoneybadger).not.toHaveBeenCalled();
  });

  it('can take a user override in the options param', async () => {
    let setUser;
    const callback = ({ user }) => {
      setUser = user;
    };

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      user: MOCK_USER,
    });

    expect(setUser).toEqual(MOCK_USER);
  });

  it('should log `user` and `results` and `event` by default', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      user: MOCK_USER,
    });

    expect(logged.includes('User')).toBeTruthy();
    expect(logged.includes('Results')).toBeTruthy();
    expect(logged.includes('Event')).toBeTruthy();
  });

  it('can optionally disable logging of `user`, `results`, and `event`', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      logEvent: false,
      logResults: false,
      logUser: false,
      user: MOCK_USER,
    });

    expect(logged.includes('User')).toBeFalsy();
    expect(logged.includes('Results')).toBeFalsy();
    expect(logged.includes('Event')).toBeFalsy();
  });

  it('can use a custom label for logged `user`, `results`, and `event` data', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      logEvent: true,
      logEventLabel: 'The thing that happened',
      logResultsLabel: 'The stuff that came out',
      logUserLabel: 'Who did the thing',
      user: MOCK_USER,
    });

    expect(logged.includes('User')).toBeFalsy();
    expect(logged.includes('Results')).toBeFalsy();
    expect(logged.includes('Event')).toBeFalsy();

    expect(logged.includes('The thing that happened')).toBeTruthy();
    expect(logged.includes('The stuff that came out')).toBeTruthy();
    expect(logged.includes('Who did the thing')).toBeTruthy();
  });

  it('logs the user as Public User when isPublicUser is true and logUser is not false (default is true)', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      isPublicUser: true,
      logResults: false, // by default, this is true - setting to false so only the user is logged (defaults to true)
      user: {},
    });

    expect(logged.includes('User')).toBeTruthy();
    expect(lastLoggedValue).toEqual('Public User');
  });

  it('returns the results of a successful execution', async () => {
    const callback = () => {
      return Promise.resolve('some data');
    };

    const result = await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      user: MOCK_USER,
    });

    expect(JSON.parse(result.body)).toEqual('some data');
  });

  it('returns the results of a successful execution without attempting to filter if skipFiltering is true', async () => {
    const callback = () => {
      return Promise.resolve({ data: 'some data', entityName: 'Case' });
    };

    const result = await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      skipFiltering: true,
      user: MOCK_USER,
    });

    expect(JSON.parse(result.body)).toEqual({
      data: 'some data',
      entityName: 'Case',
    });
  });

  it('returns the results of a successful execution and filters via entity constructor if the return data contains entityName', async () => {
    const callback = () => {
      return Promise.resolve({
        data: 'some data',
        entityName: 'Case',
        public: 'public data',
      });
    };

    const result = await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      user: MOCK_USER,
    });

    expect(JSON.parse(result.body)).toEqual({ public: 'public data' });
  });

  describe('dataSecurityFilter', () => {
    it('returns data as it was passed in if entityName is not present', () => {
      const data = {
        private: 'private',
        public: 'public',
      };
      const result = dataSecurityFilter(data, { applicationContext });
      expect(result).toEqual(data);
    });

    it('returns data after passing through entity constructor if entityName is present', () => {
      const data = {
        entityName: 'MockEntity',
        private: 'private',
        public: 'public',
      };
      const result = dataSecurityFilter(data, { applicationContext });
      expect(result).toEqual({
        public: 'public',
      });
    });

    it('returns data without passing through entity constructor if entityName is not present in getEntityConstructors', () => {
      applicationContext.getEntityByName.mockImplementation(() => null);
      const data = {
        entityName: 'MockEntity2',
        private: 'private',
        public: 'public',
      };
      const result = dataSecurityFilter(data, { applicationContext });
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
      const result = dataSecurityFilter(data, { applicationContext });
      expect(result).toEqual([{ public: 'public' }, { public: 'public' }]);
    });

    it('returns array data after passing through entity constructor if entityName is present on array element', () => {
      applicationContext.getEntityByName.mockImplementation(() => null);
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
      const result = dataSecurityFilter(data, { applicationContext });
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
});

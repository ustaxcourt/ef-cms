const { genericHandler } = require('./genericHandler');

const token =
  'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoic2dhcEEyWk1XcGxudnFaRHhGWUVzUSIsInN1YiI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfN3VSa0YwQXhuIiwiY29nbml0bzp1c2VybmFtZSI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImF1ZCI6IjZ0dTZqMXN0djV1Z2N1dDdkcXNxZHVybjhxIiwiZXZlbnRfaWQiOiIzMGIwYjJiMi0zMDY0LTExZTktOTk0Yi03NTIwMGE2ZTQ3YTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU1MDE1NDI0OCwibmFtZSI6IlRlc3QgUGV0aXRpb25lciIsImV4cCI6MTU1MDE1Nzg0OCwiY3VzdG9tOnJvbGUiOiJwZXRpdGlvbmVyIiwiaWF0IjoxNTUwMTU0MjQ4LCJlbWFpbCI6InBldGl0aW9uZXIxQGV4YW1wbGUuY29tIn0.KBEzAj84SV6Pulu9SEjGqbIPtL_iAeC-Tcc3fvphZ_nLHuIgN7LRv8pM-ClMM3Sua5YVQ7h70N1wRV0UZADxHiEDN5pYshcsjhZdnT9sWN9Nu5QT4l9e1zFsgu1S_p9M29i0__si674VT16hlXHCywrrqrofaJYZgMVXjvfEKYDmUo4XPCGN0GVFtt9sepxjAwd5rRIF9Ned3XGBQ2xrQd5qWlIMsvnhdlIL9FqvC47_ZsPh16IyREp7FDAEI5LxIkJOFE2Ryoe74cg_9nIaqP3rQsRrRMk7E_mQ9yGV4_2j4PEfoehm3wHbrGvhNFdDBDMosS3OfbUY411swAAh3Q';

const MOCK_EVENT = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const MOCK_USER = { name: 'Test User', userId: '1' };

let logged = [];

let applicationContext = {};
let logErrorMock;

describe('genericHandler', () => {
  beforeEach(() => {
    logErrorMock = jest.fn();

    logged = [];
    applicationContext.logger = {
      error: logErrorMock,
      info: label => {
        logged.push(label);
      },
    };
  });

  it('returns an error if the callback throws', async () => {
    let errors;

    const callback = () => {
      return Promise.reject(new Error('Test Error'));
    };

    try {
      return genericHandler(MOCK_EVENT, callback, {
        applicationContext,
      });
    } catch (err) {
      errors = err;
    }

    expect(errors).toBeTruthy();
    expect(logErrorMock).toHaveBeenCalled();
  });

  it('does not call application.logger.error if the skipLogging flag is present on the error', async () => {
    let errors;

    const callback = () => {
      const error = new Error('Test Error');
      error.skipLogging = true;
      return Promise.reject(error);
    };

    try {
      return genericHandler({ ...MOCK_EVENT }, callback, {
        applicationContext,
      });
    } catch (err) {
      errors = err;
    }

    expect(errors).toBeTruthy();
    expect(logErrorMock).toHaveBeenCalled();
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

  it('should log `user` and `results` but not `event` by default', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      user: MOCK_USER,
    });

    expect(logged.includes('User')).toBeTruthy();
    expect(logged.includes('Results')).toBeTruthy();
    expect(logged.includes('Event')).toBeFalsy();
  });

  it('can optionally disable logging of `user` and `results` and enable `event`', async () => {
    const callback = () => null;

    await genericHandler(MOCK_EVENT, callback, {
      applicationContext,
      logEvent: true,
      logResults: false,
      logUser: false,
      user: MOCK_USER,
    });

    expect(logged.includes('User')).toBeFalsy();
    expect(logged.includes('Results')).toBeFalsy();
    expect(logged.includes('Event')).toBeTruthy();
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
});

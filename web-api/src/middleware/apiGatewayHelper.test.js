const {
  getAuthHeader,
  getUserFromAuthHeader,
  handle,
  redirect,
} = require('./apiGatewayHelper');
const {
  NotFoundError,
  UnauthorizedError,
} = require('../../../shared/src/errors/errors');

const EXPECTED_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

// Suppress console output in test runner (RAE SAID THIS WOULD BE COOL)
console.error = () => null;
console.info = () => null;

describe('handle', () => {
  it('should handle a response with pdf data', async () => {
    const response = await handle({}, async () => '%PDF-'); // contains pdf header
    expect(response).toEqual({
      body: '%PDF-',
      headers: {
        ...EXPECTED_HEADERS,
        'Content-Type': 'application/pdf',
        'accept-ranges': 'bytes',
      },
      isBase64Encoded: true,
      statusCode: 200,
    });
  });

  it('should filter data based on the fields query string option', async () => {
    const response = await handle(
      {
        queryStringParameters: {
          fields: 'caseId,docketNumber',
        },
      },
      async () => ({
        caseId: '1',
        docketNumber: 'b',
        gg: undefined,
        isAwesome: true,
        something: 'false',
        yup: null,
      }),
    );
    expect(response).toMatchObject({
      body: JSON.stringify({
        caseId: '1',
        docketNumber: 'b',
      }),
    });
  });

  it('should filter array data based on the fields query string option', async () => {
    const response = await handle(
      {
        queryStringParameters: {
          fields: 'caseId,docketNumber',
        },
      },
      async () => [
        {
          caseId: '1',
          docketNumber: 'b',
          gg: undefined,
          isAwesome: true,
          something: 'false',
          yup: null,
        },
        {
          caseId: '2',
          docketNumber: 'c',
          gg: undefined,
          isAwesome: false,
          something: 'true',
          yup: null,
        },
      ],
    );
    expect(response).toMatchObject({
      body: JSON.stringify([
        {
          caseId: '1',
          docketNumber: 'b',
        },
        {
          caseId: '2',
          docketNumber: 'c',
        },
      ]),
    });
  });

  it('should return an object representing an 200 status back if the callback function executes successfully', async () => {
    const response = await handle({}, async () => 'success');
    expect(response).toEqual({
      body: JSON.stringify('success'),
      headers: EXPECTED_HEADERS,
      statusCode: '200',
    });
  });

  it('should return an object representing 500 status if the function returns an unsanitized entity (response contains private data as defined in app context)', async () => {
    const response = await handle({}, async () => ({
      pk: 'this is bad!',
    }));
    expect(response).toEqual({
      body: JSON.stringify('Unsanitized entity'),
      headers: EXPECTED_HEADERS,
      statusCode: 500,
    });
  });

  it('should return 200 status if response is undefined', async () => {
    const response = await handle({}, async () => undefined);
    expect(response).toEqual({
      body: undefined,
      headers: EXPECTED_HEADERS,
      statusCode: '200',
    });
  });

  it('should return 200 status if response is an array with an undefined value', async () => {
    const response = await handle({}, async () => [undefined]);
    expect(response).toEqual({
      body: JSON.stringify([undefined]),
      headers: EXPECTED_HEADERS,
      statusCode: '200',
    });
  });

  it('should return an object representing 500 status if the function returns an unsanitized entity as an array (response contains private data as defined in app context)', async () => {
    const response = await handle({}, async () => [
      {
        pk: 'this is bad!',
      },
    ]);
    expect(response).toEqual({
      body: JSON.stringify('Unsanitized entity'),
      headers: EXPECTED_HEADERS,
      statusCode: 500,
    });
  });

  it('should return an object representing an 404 status if the function returns a NotFoundError', async () => {
    const response = await handle({}, async () => {
      throw new NotFoundError('not-found error');
    });
    expect(response).toEqual({
      body: JSON.stringify('not-found error'),
      headers: EXPECTED_HEADERS,
      statusCode: 404,
    });
  });

  it('should return an object representing an 403 status if the function returns an UnauthorizedError', async () => {
    const response = await handle({}, async () => {
      throw new UnauthorizedError('unauthorized error');
    });
    expect(response).toEqual({
      body: JSON.stringify('unauthorized error'),
      headers: EXPECTED_HEADERS,
      statusCode: 403,
    });
  });

  it('should return an object representing an 400 status if the function returns an Error', async () => {
    const response = await handle({}, async () => {
      throw new Error('other error');
    });
    expect(response).toEqual({
      body: JSON.stringify('other error'),
      headers: EXPECTED_HEADERS,
      statusCode: '400',
    });
  });
});

describe('getAuthHeader', () => {
  it('should return the user token from the authorization header', () => {
    const response = getAuthHeader({
      headers: {
        Authorization: 'Bearer petitioner',
      },
    });
    expect(response).toEqual('petitioner');
  });

  it('should return the user token from the authorization header (lowercase a in authorization)', () => {
    const response = getAuthHeader({
      headers: {
        authorization: 'Bearer petitioner',
      },
    });
    expect(response).toEqual('petitioner');
  });

  it('should return the user token from the Authorization header #3', () => {
    let error;
    try {
      getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('should return the user token from the Authorization header query string params', () => {
    let error;
    let response;
    try {
      response = getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
        queryStringParameters: {
          token: 'token',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(response).toEqual('token');
    expect(error).toEqual(undefined);
  });

  it('should not return the user token and should throw an error if token is not present in queryStringParameters or anywhere else', () => {
    let error;
    let response;
    try {
      response = getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
        queryStringParameters: {},
      });
    } catch (err) {
      error = err;
    }
    expect(response).toEqual(undefined);
    expect(error).toBeDefined();
  });

  it('should return the user token from the Authorization header query string params passed in as "query"', () => {
    let error;
    let response;
    try {
      response = getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
        query: {
          token: 'token',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(response).toEqual('token');
    expect(error).toEqual(undefined);
  });

  it('should not return the user token and should throw an error if token is not present in query or anywhere else', () => {
    let error;
    let response;
    try {
      response = getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
        query: {},
      });
    } catch (err) {
      error = err;
    }
    expect(response).toEqual(undefined);
    expect(error).toBeDefined();
  });

  it('should return null and should not throw an error if token is not present', () => {
    let error;
    let response;
    try {
      response = getAuthHeader({});
    } catch (err) {
      error = err;
    }
    expect(response).toEqual(null);
    expect(error).toBeUndefined();
  });
});

describe('getUserFromAuthHeader', () => {
  const token =
    'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoic2dhcEEyWk1XcGxudnFaRHhGWUVzUSIsInN1YiI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfN3VSa0YwQXhuIiwiY29nbml0bzp1c2VybmFtZSI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImF1ZCI6IjZ0dTZqMXN0djV1Z2N1dDdkcXNxZHVybjhxIiwiZXZlbnRfaWQiOiIzMGIwYjJiMi0zMDY0LTExZTktOTk0Yi03NTIwMGE2ZTQ3YTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU1MDE1NDI0OCwibmFtZSI6IlRlc3QgUGV0aXRpb25lciIsImV4cCI6MTU1MDE1Nzg0OCwiY3VzdG9tOnJvbGUiOiJwZXRpdGlvbmVyIiwiaWF0IjoxNTUwMTU0MjQ4LCJlbWFpbCI6InBldGl0aW9uZXIxQGV4YW1wbGUuY29tIn0.KBEzAj84SV6Pulu9SEjGqbIPtL_iAeC-Tcc3fvphZ_nLHuIgN7LRv8pM-ClMM3Sua5YVQ7h70N1wRV0UZADxHiEDN5pYshcsjhZdnT9sWN9Nu5QT4l9e1zFsgu1S_p9M29i0__si674VT16hlXHCywrrqrofaJYZgMVXjvfEKYDmUo4XPCGN0GVFtt9sepxjAwd5rRIF9Ned3XGBQ2xrQd5qWlIMsvnhdlIL9FqvC47_ZsPh16IyREp7FDAEI5LxIkJOFE2Ryoe74cg_9nIaqP3rQsRrRMk7E_mQ9yGV4_2j4PEfoehm3wHbrGvhNFdDBDMosS3OfbUY411swAAh3Q';
  it('should return the user from the authorization header', () => {
    const user = getUserFromAuthHeader({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(user.name).toEqual('Test Petitioner');
  });

  it('should return null if the user token is not a valid jwt token', () => {
    const user = getUserFromAuthHeader({
      headers: {
        Authorization: 'Bearer 123',
      },
    });
    expect(user).toEqual(null);
  });

  it('should return null if there is no token', () => {
    const user = getUserFromAuthHeader({});
    expect(user).toEqual(null);
  });
});

describe('redirect', () => {
  it('should return a redirect status in the header', async () => {
    const response = await redirect({}, async () => ({ url: 'example.com' }));
    expect(response).toEqual({
      headers: {
        Location: 'example.com',
      },
      statusCode: 302,
    });
  });

  it('should return error object on errors', async () => {
    const response = await redirect({}, async () => {
      throw new Error('an error');
    });
    expect(response).toEqual({
      body: JSON.stringify('an error'),
      headers: EXPECTED_HEADERS,
      statusCode: '400',
    });
  });
});

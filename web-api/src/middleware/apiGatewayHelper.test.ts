import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ROLES } from '../../../shared/src/business/entities/EntityConstants';
import {
  getAuthHeader,
  getConnectionIdFromEvent,
  getUserFromAuthHeader,
  handle,
  redirect,
} from './apiGatewayHelper';
import jwt from 'jsonwebtoken';

const EXPECTED_HEADERS = {
  'Access-Control-Expose-Headers': 'X-Terminal-User',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  Vary: 'Authorization',
  'X-Content-Type-Options': 'nosniff',
};

// Suppress console output in test runner (RAE SAID THIS WOULD BE COOL)
console.error = jest.fn().mockImplementation(() => null);
console.info = () => null;

describe('handle', () => {
  it('should handle a response with pdf data', async () => {
    const response = await handle({}, () => '%PDF-'); // contains pdf header
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

  it('response should have the same return values (with header overides) that fun returns if body, statusCode, and headers are present', async () => {
    const response = await handle({}, () => ({
      body: 'hi',
      headers: {},
      statusCode: 200,
    }));
    expect(response).toEqual({
      body: JSON.stringify('hi'),
      headers: {
        'Access-Control-Expose-Headers': 'X-Terminal-User',
        'Cache-Control':
          'max-age=0, private, no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        Pragma: 'no-cache',
        Vary: 'Authorization',
        'X-Content-Type-Options': 'nosniff',
      },
      statusCode: 200,
    });
  });

  it('should skip logging an error if skipLogging is true', async () => {
    await handle({}, () => {
      const e = new Error();
      e.skipLogging = true;
      throw e;
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log an error if skipLogging is false and CI is false', async () => {
    process.env.CI = 'true';
    await handle({}, () => {
      const e = new Error();
      e.skipLogging = false;
      throw e;
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log an error if skipLogging is false and CI is false', async () => {
    process.env.CI = 'true';
    await handle({}, () => {
      const e = new Error();
      e.skipLogging = true;
      throw e;
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log an error if skipLogging is false and CI is false', async () => {
    delete process.env.CI;
    await handle({}, () => {
      const e = new Error();
      e.skipLogging = false;
      throw e;
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('should filter data based on the fields query string option', async () => {
    const response = await handle(
      {
        queryStringParameters: {
          fields: 'docketEntryId,docketNumber',
        },
      },
      () => ({
        docketEntryId: '1',
        docketNumber: 'b',
        gg: undefined,
        isAwesome: true,
        something: 'false',
        yup: null,
      }),
    );
    expect(response).toMatchObject({
      body: JSON.stringify({
        docketEntryId: '1',
        docketNumber: 'b',
      }),
    });
  });

  it('should filter array data based on the fields query string option', async () => {
    const response = await handle(
      {
        queryStringParameters: {
          fields: 'docketEntryId,docketNumber',
        },
      },
      () => [
        {
          docketEntryId: '1',
          docketNumber: 'b',
          gg: undefined,
          isAwesome: true,
          something: 'false',
          yup: null,
        },
        {
          docketEntryId: '2',
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
          docketEntryId: '1',
          docketNumber: 'b',
        },
        {
          docketEntryId: '2',
          docketNumber: 'c',
        },
      ]),
    });
  });

  it('should return an object representing an 200 status back if the callback function executes successfully', async () => {
    const response = await handle({}, () => 'success');
    expect(response).toEqual({
      body: JSON.stringify('success'),
      headers: EXPECTED_HEADERS,
      statusCode: '200',
    });
  });

  it('should return an object representing 500 status if the function returns an unsanitized entity (response contains private data as defined in app context)', async () => {
    const response = await handle({}, () => ({
      pk: 'this is bad!',
    }));
    expect(response).toEqual({
      body: JSON.stringify('Unsanitized entity'),
      headers: EXPECTED_HEADERS,
      statusCode: 500,
    });
  });

  it('should return 200 status if response is undefined', async () => {
    const response = await handle({}, () => undefined);
    expect(response).toEqual({
      body: undefined,
      headers: EXPECTED_HEADERS,
      statusCode: '200',
    });
  });

  it('should return 200 status if response is an array with an undefined value', async () => {
    const response = await handle({}, () => [undefined]);
    expect(response).toEqual({
      body: JSON.stringify([undefined]),
      headers: EXPECTED_HEADERS,
      statusCode: '200',
    });
  });

  it('should return an object representing 500 status if the function returns an unsanitized entity as an array (response contains private data as defined in app context)', async () => {
    const response = await handle({}, () => [
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
    const response = await handle({}, () => {
      throw new NotFoundError('not-found error');
    });
    expect(response).toEqual({
      body: JSON.stringify('not-found error'),
      headers: EXPECTED_HEADERS,
      statusCode: 404,
    });
  });

  it('should return an object representing an 403 status if the function returns an UnauthorizedError', async () => {
    const response = await handle({}, () => {
      throw new UnauthorizedError('unauthorized error');
    });
    expect(response).toEqual({
      body: JSON.stringify('unauthorized error'),
      headers: EXPECTED_HEADERS,
      statusCode: 403,
    });
  });

  it('should return an object representing an 400 status if the function returns an Error', async () => {
    const response = await handle({}, () => {
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
  let mockUser = {
    'custom:role': ROLES.privatePractitioner,
    'custom:userId': '188a5b0f-e7ae-4647-98a1-43a0d4d00eee',
    name: 'Test Petitioner',
  };

  let token = jwt.sign(mockUser, 'secret');

  it('should return the user from the authorization header', () => {
    const user = getUserFromAuthHeader({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(user.name).toEqual(mockUser.name);
  });

  it('should return undefined if the user token is not a valid jwt token', () => {
    const user = getUserFromAuthHeader({
      headers: {
        Authorization: 'Bearer 123',
      },
    });
    expect(user).toEqual(undefined);
  });

  it('should return undefined if there is no token', () => {
    const user = getUserFromAuthHeader({});
    expect(user).toEqual(undefined);
  });

  it('returns custom:userId when it is present in the token', () => {
    const user = getUserFromAuthHeader({
      headers: {
        Authorization: `Bearer ${token}`,
        token,
      },
    });
    expect(user.userId).toEqual(mockUser['custom:userId']);
  });

  describe('redirect', () => {
    it('should return a redirect status in the header', async () => {
      const response = await redirect({}, () => ({ url: 'example.com' }));
      expect(response).toEqual({
        headers: {
          Location: 'example.com',
        },
        statusCode: 302,
      });
    });

    it('should return error object on errors', async () => {
      const response = await redirect({}, () => {
        throw new Error('an error');
      });
      expect(response).toEqual({
        body: JSON.stringify('an error'),
        headers: EXPECTED_HEADERS,
        statusCode: '400',
      });
    });
  });

  describe('getConnectionIdFromEvent', () => {
    it('should return clientConnectionId from queryStringParameters if it exists', async () => {
      const response = await getConnectionIdFromEvent({
        queryStringParameters: { clientConnectionId: 'abc-123' },
      });
      expect(response).toEqual('abc-123');
    });
  });
});

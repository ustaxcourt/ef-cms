import {
  getMetadataLines,
  redact,
  removeDuplicateLogInformation,
} from './createLogger';

describe('getMetadataLines', () => {
  it('should get empty array with no info', () => {
    const metadata = {};
    const expected = [];
    const actual = getMetadataLines(metadata);
    expect(actual).toEqual(expected);
  });

  it('should get empty array with only undefined properties', () => {
    const metadata = { fieldOne: undefined, fieldTwo: undefined };
    const expected = [];
    const actual = getMetadataLines(metadata);
    expect(actual).toEqual(expected);
  });

  it('should get empty array with only level and message properties', () => {
    const metadata = { level: 'info', message: 'some message' };
    const expected = [];
    const actual = getMetadataLines(metadata);
    expect(actual).toEqual(expected);
  });
});

describe('redact', () => {
  const mockLogEntry = {
    environment: {
      color: 'blue',
      stage: 'stg',
    },
    level: 'info',
    message:
      'Request ended: PUT /async/users/a1a0a206-what-isit-b725-61cd4e3aece2/contact-info',
    request: {
      body: '{"contactInfo":{"address2":"Apartment 4","address3":"Under the stairs","city":"Chicago","countryType":"domestic","phone":"+1 (555) 555-5555","postalCode":"61234","state":"IL","address1":"76791 Toni Pine"},"firmName":"Some Firm"}',
      headers: {
        Authorization:
          'Bearer hellothereeyJraWQURJQXlDdVdJUU1XYXZYZ1ZxWFJsQXRPcWZZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMWEwYTIwNi1hN2Y1LTQ1ZWYtYjcyNS02MWNkNGUzYWVjZTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfOEgyZ3NlbE9iIiwiY29nbml0bzp1c2VybmFtZSI6ImExYTBhMjA2LWE3ZjUtNDVlZi1iNzI1LTYxY2Q0ZTNhZWNlMiIsImF1ZCI6IjZjYmNqOWx0amM0bzI4Njd0bWRqNzVvaTByIiwiZXZlbnRfaWQiOiIwY2QwOTEyZS1iNmJiLTRhMWQtOTljNC1kZGIwMjk3YzNkNGEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1NjEwNTEzNSwibmFtZSI6IlRlc3QgcHJpdmF0ZSBwcmFjdGl0aW9uZXIxIiwiZXhwIjoxNjU2MTA4NzM1LCJjdXN0b206cm9sZSI6InByaXZhdGVQcmFjdGl0aW9uZXIiLCJpYXQiOjE2NTYxMDUxMzUsImVtYWlsIjoicHJpdmF0ZVByYWN0aXRpb25lcjFAZXhhbXBsZS5jb20ifQ.cR1QzsI981gr3rCkWEI7919j3aNMcUI1d6AzfP5Qeb9QSg0_t0vvHu6Wxvjl-_jR23W6HmzHVg3kS7GWkHWvpX2zJi53Ij8SGhRwYrPQEM_tq5dZlD3Uqw9EZJi_s9e_09V1biveNZZxpC3jxELuePeJP8ypIloUz4moOIP2-Sd1zIWFWt5tOSYEW81ErV38td6lUGTy33Kw5fdXLMCSbi0Du6dVvBbz-Qsmg18-cyvOV3KceeGj4R_kckng4-S_1VcL-4r23aH-3FB5Bkw7tHlrAeAboXeYkgj6dQ5C0ManJzH1rs5Es9A3QStl-Enia8C-8tSHli76LQjDxtmdew',
        authorization:
          'Bearer hellothereXYXZYZ1ZxWFJsQXRPcWZZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMWEwYTIwNi1hN2Y1LTQ1ZWYtYjcyNS02MWNkNGUzYWVjZTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfOEgyZ3NlbE9iIiwiY29nbml0bzp1c2VybmFtZSI6ImExYTBhMjA2LWE3ZjUtNDVlZi1iNzI1LTYxY2Q0ZTNhZWNlMiIsImF1ZCI6IjZjYmNqOWx0amM0bzI4Njd0bWRqNzVvaTByIiwiZXZlbnRfaWQiOiIwY2QwOTEyZS1iNmJiLTRhMWQtOTljNC1kZGIwMjk3YzNkNGEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1NjEwNTEzNSwibmFtZSI6IlRlc3QgcHJpdmF0ZSBwcmFjdGl0aW9uZXIxIiwiZXhwIjoxNjU2MTA4NzM1LCJjdXN0b206cm9sZSI6InByaXZhdGVQcmFjdGl0aW9uZXIiLCJpYXQiOjE2NTYxMDUxMzUsImVtYWlsIjoicHJpdmF0ZVByYWN0aXRpb25lcjFAZXhhbXBsZS5jb20ifQ.cR1QzsI981gr3rCkWEI7919j3aNMcUI1d6AzfP5Qeb9QSg0_t0vvHu6Wxvjl-_jR23W6HmzHVg3kS7GWkHWvpX2zJi53Ij8SGhRwYrPQEM_tq5dZlD3Uqw9EZJi_s9e_09V1biveNZZxpC3jxELuePeJP8ypIloUz4moOIP2-Sd1zIWFWt5tOSYEW81ErV38td6lUGTy33Kw5fdXLMCSbi0Du6dVvBbz-Qsmg18-cyvOV3KceeGj4R_kckng4-S_1VcL-4r23aH-3FB5Bkw7tHlrAeAboXeYkgj6dQ5C0ManJzH1rs5Es9A3QStl-Enia8C-8tSHli76LQjDxtmdew',
        'content-length': 228,
        'content-type': 'application/json',
      },
      method: 'PUT',
      url: '/async/users/a1a0a206-what-isit-b725-61cd4e3aece2/contact-info',
    },
    requestId: {
      lambda: 'c9584f45-ice-cream-8f61-bbba387b71f0',
    },
    response: {
      responseTimeMs: 52074,
      statusCode: 200,
    },
    user: {
      email: 'privatepractitioner1@example.com',
      entityName: 'User',
      name: 'Test private practitioner1',
      role: 'privatePractitioner',
      token: 'funxJsQXRPcWZZPSIsImFsZyI6IlJTMjU2In0',
      userId: 'a1a0a206-what-isit-b725-61cd4e3aece2',
    },
  };

  it('should remove sensitive information and preserve important information from a log entry', () => {
    const redactedLogEntry = redact().transform(mockLogEntry);

    // redact sensitive information
    expect(redactedLogEntry.request.headers.Authorization).toBe(undefined);
    expect(redactedLogEntry.request.headers.authorization).toBe(undefined);
    expect(redactedLogEntry.user.token).toBe(undefined);

    // preserve important information
    expect(redactedLogEntry.request.headers['content-length']).toBe(228);
    expect(redactedLogEntry.request.headers['content-type']).toBe(
      'application/json',
    );
    expect(redactedLogEntry.request.method).toBe('PUT');
    expect(redactedLogEntry.request.url).toBe(
      '/async/users/a1a0a206-what-isit-b725-61cd4e3aece2/contact-info',
    );
    expect(redactedLogEntry.user.email).toBe(
      'privatepractitioner1@example.com',
    );
  });
});

describe('removeDuplicateLogInformation', () => {
  const mockLogEntry = {
    context: {
      environment: 'test',
      level: 'error',
      message: 'Email service health check failed. Rate exceeded',
      metadata: {
        code: 'Throttling',
        retryable: true,
        stack:
          'Throttling: Rate exceeded\\n at Request.extractError ' +
          '(/var/runtime/node_modules/aws-sdk/lib/protocol/query.js:50:29)\\n ' +
          'at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20)\\n ' +
          'at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10)\\n ' +
          'at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:686:14)\\n ' +
          'at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10)\\n ' +
          'at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12)\\n ' +
          'at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10\\n ' +
          'at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9)\\n ' +
          'at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:688:12)\\n ' +
          'at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18)',
        statusCode: 400,
        time: '2022-08-05T18:55:04.708Z',
      },
      request: {
        body: {},
        headers: {
          accept: '*/*',
          'accept-encoding': 'identity,gzip,deflate',
          host: 'public-api.stg.ef-cms.ustaxcourt.gov',
          'user-agent':
            'Amazon-Route53-Health-Check-Service (ref 9fbb1225-66df-4837-a0c8-12df057ff0eb; report http://amzn.to/1vsZADi)',
          'x-amzn-trace-id': 'Root=1-62ed6785-15b3374a2aa796500d42c17d',
          'x-forwarded-for': '123.456.78.90',
          'x-forwarded-port': 443,
          'x-forwarded-proto': 'https',
        },
        method: 'GET',
        url: '/public-api/health',
      },
      requestId: 'e82bd012-ce9a-4230-9ab6-69e2d2fa0502',
      timestamp: '2022-08-05T18:55:04.709Z',
      user: 'unauthenticated',
      zTotallyUnexpectedKey: 'Chill out on the requests please',
    },
    environment: {
      color: 'blue',
      stage: 'stg',
    },
    level: 'error',
    logGroup: '/aws/lambda/api_public_stg_blue',
    logStream: '2022/08/05/[$LATEST]65150752d18a4837babc2e13107fdb5c',
    message: 'Email service health check failed. Rate exceeded',
    metadata: {
      code: 'Throttling',
      retryable: true,
      stack:
        'Throttling: Rate exceeded\\n at Request.extractError ' +
        '(/var/runtime/node_modules/aws-sdk/lib/protocol/query.js:50:29)\\n ' +
        'at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20)\\n ' +
        'at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10)\\n ' +
        'at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:686:14)\\n ' +
        'at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10)\\n ' +
        'at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12)\\n ' +
        'at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10\\n ' +
        'at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9)\\n ' +
        'at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:688:12)\\n ' +
        'at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18)',
      statusCode: 400,
      time: '2022-08-05T18:55:04.708Z',
    },
    request: {
      body: {},
      headers: {
        accept: '*/*',
        'accept-encoding': 'identity,gzip,deflate',
        host: 'public-api.stg.ef-cms.ustaxcourt.gov',
        'user-agent':
          'Amazon-Route53-Health-Check-Service (ref 9fbb1225-66df-4837-a0c8-12df057ff0eb; report http://amzn.to/1vsZADi)',
        'x-amzn-trace-id': 'Root=1-62ed6785-15b3374a2aa796500d42c17d',
        'x-forwarded-for': '123.456.78.90',
        'x-forwarded-port': 443,
        'x-forwarded-proto': 'https',
      },
      method: 'GET',
      url: '/public-api/health',
    },
    requestId: {
      apiGateway: 'e82bd012-ce9a-4230-9ab6-69e2d2fa0502',
      applicationLoadBalancer: 'Root=1-b0e37f79-3203-4c45-981a-7370b59370b1',
      lambda: '09e02bed-ad6f-4b0c-a8da-ad0a2a49157d',
    },
    timestamp: '2022-08-05T18:55:04.709Z',
    user: {
      role: 'unauthenticated',
    },
    zTotallyUnexpectedKey: 'Chill out on the requests please',
  };
  const formattedLogEntry =
    removeDuplicateLogInformation().transform(mockLogEntry);

  it('removes duplicate data from the context object', () => {
    const expectedBaseKeys = [
      'context',
      'environment',
      'level',
      'logGroup',
      'logStream',
      'message',
      'metadata',
      'request',
      'requestId',
      'timestamp',
      'user',
      'zTotallyUnexpectedKey',
    ];
    expect(Object.keys(formattedLogEntry).sort()).toEqual(expectedBaseKeys);

    // assert that data also in the base object is removed from the context object
    const expectedContextKeys = ['environment', 'requestId', 'user'];
    expect(Object.keys(formattedLogEntry.context).sort()).toEqual(
      expectedContextKeys,
    );
  });

  it('does not overwrite any defaultMeta, even if data was provided for one or more of the defaultMeta fields', () => {
    expect(formattedLogEntry.environment instanceof Object).toBeTruthy();
    expect(formattedLogEntry.requestId instanceof Object).toBeTruthy();
    expect(formattedLogEntry.user instanceof Object).toBeTruthy();
  });
});

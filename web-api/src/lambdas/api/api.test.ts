import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';

type ConfiguredHandler = APIGatewayProxyHandler & {
  log: {
    debug: jest.Mock;
    error: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
  };
};

const mockAwsServerlessExpress = jest.fn<
  ConfiguredHandler,
  [{ app: unknown }]
>();

jest.mock('../../app', () => ({
  app: { name: 'private-app' },
}));

jest.mock('@codegenie/serverless-express', () => ({
  __esModule: true,
  default: mockAwsServerlessExpress,
}));

const createMockEvent = (
  overrides: Partial<APIGatewayProxyEvent> = {},
): APIGatewayProxyEvent => ({
  body: null,
  headers: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
  path: '/some/path',
  pathParameters: {
    proxy: 'some/path',
  },
  queryStringParameters: null,
  requestContext: {
    accountId: '123456789012',
    apiId: 'api-id',
    authorizer: null,
    httpMethod: 'GET',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: 'jest',
      userArn: null,
    },
    path: '/some/path',
    protocol: 'HTTP/1.1',
    requestId: 'request-id',
    requestTimeEpoch: 1,
    resourceId: 'resource-id',
    resourcePath: '/{proxy+}',
    stage: 'dev',
  },
  resource: '/{proxy+}',
  stageVariables: null,
  ...overrides,
});

const createMockContext = (): Context => ({
  awsRequestId: 'aws-request-id',
  callbackWaitsForEmptyEventLoop: false,
  clientContext: undefined,
  done: jest.fn(),
  fail: jest.fn(),
  functionName: 'function-name',
  functionVersion: '1',
  getRemainingTimeInMillis: () => 1000,
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test',
  logGroupName: 'log-group-name',
  logStreamName: 'log-stream-name',
  memoryLimitInMB: '1024',
  succeed: jest.fn(),
});

const createConfiguredHandler = (): {
  configuredHandler: ConfiguredHandler;
  serverlessHandler: jest.MockedFunction<APIGatewayProxyHandler>;
} => {
  const serverlessHandler: jest.MockedFunction<APIGatewayProxyHandler> =
    jest.fn();
  const configuredHandler: ConfiguredHandler = Object.assign(
    serverlessHandler,
    {
      log: {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
      },
    },
  );

  return {
    configuredHandler,
    serverlessHandler,
  };
};

describe('api lambda handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('forwards the request to the configured serverless-express handler', async () => {
    const { configuredHandler, serverlessHandler } = createConfiguredHandler();
    const expectedResponse: APIGatewayProxyResult = {
      body: 'ok',
      statusCode: 200,
    };
    const event = createMockEvent({ body: '{"message":"hello"}' });
    const context = createMockContext();
    const callback: Callback<APIGatewayProxyResult> = jest.fn();

    serverlessHandler.mockImplementation(() =>
      Promise.resolve(expectedResponse),
    );
    mockAwsServerlessExpress.mockReturnValue(configuredHandler);

    const { handler } = require('./api') as { handler: APIGatewayProxyHandler };

    const result = await handler(event, context, callback);

    expect(mockAwsServerlessExpress).toHaveBeenCalledWith({
      app: { name: 'private-app' },
    });
    expect(serverlessHandler).toHaveBeenCalledWith(event, context, callback);
    expect(result).toEqual(expectedResponse);
  });

  it('rewrites auth proxy paths and stringifies object request bodies', async () => {
    const { configuredHandler, serverlessHandler } = createConfiguredHandler();
    const event = createMockEvent({
      path: '/auth/some-route',
      pathParameters: {
        proxy: 'some-route',
      },
      requestContext: {
        ...createMockEvent().requestContext,
        path: '/auth/some-route',
      },
    });
    const context = createMockContext();
    const callback: Callback<APIGatewayProxyResult> = jest.fn();

    Reflect.set(event, 'body', { action: 'file-document' });

    serverlessHandler.mockImplementation(() =>
      Promise.resolve({
        body: 'ok',
        statusCode: 200,
      }),
    );
    mockAwsServerlessExpress.mockReturnValue(configuredHandler);

    const { handler } = require('./api') as { handler: APIGatewayProxyHandler };

    await handler(event, context, callback);

    expect(event.pathParameters).toEqual({
      proxy: 'auth/some-route',
    });
    expect(event.body).toEqual('{"action":"file-document"}');
  });

  it('rewrites system proxy paths and preserves string request bodies', async () => {
    const { configuredHandler, serverlessHandler } = createConfiguredHandler();
    const event = createMockEvent({
      body: '{"already":"a-string"}',
      path: '/system/health',
      pathParameters: {
        proxy: 'health',
      },
      requestContext: {
        ...createMockEvent().requestContext,
        path: '/system/health',
      },
    });
    const context = createMockContext();
    const callback: Callback<APIGatewayProxyResult> = jest.fn();

    serverlessHandler.mockImplementation(() =>
      Promise.resolve({
        body: 'ok',
        statusCode: 200,
      }),
    );
    mockAwsServerlessExpress.mockReturnValue(configuredHandler);

    const { handler } = require('./api') as { handler: APIGatewayProxyHandler };

    await handler(event, context, callback);

    expect(event.pathParameters).toEqual({
      proxy: 'system/health',
    });
    expect(event.body).toEqual('{"already":"a-string"}');
  });
});

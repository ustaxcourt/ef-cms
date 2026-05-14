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

jest.mock('../../app-public', () => ({
  app: { name: 'public-app' },
}));

jest.mock('@codegenie/serverless-express', () => ({
  __esModule: true,
  default: mockAwsServerlessExpress,
}));

const createMockEvent = (): APIGatewayProxyEvent => ({
  body: null,
  headers: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
  path: '/public',
  pathParameters: null,
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
    path: '/public',
    protocol: 'HTTP/1.1',
    requestId: 'request-id',
    requestTimeEpoch: 1,
    resourceId: 'resource-id',
    resourcePath: '/{proxy+}',
    stage: 'dev',
  },
  resource: '/{proxy+}',
  stageVariables: null,
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

describe('api-public lambda handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('exports the configured serverless-express handler without a casted wrapper', async () => {
    const { configuredHandler, serverlessHandler } = createConfiguredHandler();
    const event = createMockEvent();
    const context = createMockContext();
    const callback: Callback<APIGatewayProxyResult> = jest.fn();
    const expectedResponse: APIGatewayProxyResult = {
      body: 'ok',
      statusCode: 200,
    };

    serverlessHandler.mockImplementation(() =>
      Promise.resolve(expectedResponse),
    );
    mockAwsServerlessExpress.mockReturnValue(configuredHandler);

    const { handler } = require('./api-public') as {
      handler: APIGatewayProxyHandler;
    };

    const result = await handler(event, context, callback);

    expect(mockAwsServerlessExpress).toHaveBeenCalledWith({
      app: { name: 'public-app' },
    });
    expect(handler).toBe(configuredHandler);
    expect(serverlessHandler).toHaveBeenCalledWith(event, context, callback);
    expect(result).toEqual(expectedResponse);
  });
});

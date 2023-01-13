const documentClientMock = {
  get: null,
  put: null,
  scan: null,
};
const DynamoDBMock = class {
  constructor() {}
};
const deleteMessageMock = jest.fn().mockReturnValue({
  promise: () => Promise.resolve({}),
});
const SQSMock = class {
  constructor() {
    this.deleteMessage = deleteMessageMock;
  }
};

DynamoDBMock.DocumentClient = jest.fn().mockReturnValue(documentClientMock);
DynamoDBMock.Converter = { marshall: jest.fn() };
jest.mock('aws-sdk', () => {
  return { DynamoDB: DynamoDBMock, SQS: SQSMock };
});
jest.mock('promise-retry', () => cb => {
  return cb();
});
jest.mock('./migrationsToRun', () => ({
  migrationsToRun: [
    {
      key: 'just-a-test',
      script: jest
        .fn()
        .mockReturnValue([{ pk: 'case|101-20', sk: 'case|101-20' }]),
    },
  ],
}));
const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};
let failValidation = false;
const mockApplicationContext = {
  getEntityByName: () =>
    function () {
      this.validateForMigration = () => {
        if (failValidation) {
          throw new Error('fail');
        }
      };
    },
  logger: mockLogger,
};
jest.mock(
  '../../../src/applicationContext',
  () => () => mockApplicationContext,
);
const { handler } = require('./migration-segments');

describe('migration-segments', () => {
  const mockLambdaEvent = {
    Records: [
      {
        body: JSON.stringify({ segment: 0, totalSegments: 1 }),
        receiptHandle: 'abc',
      },
    ],
  };

  beforeEach(() => {
    documentClientMock.get = () => ({
      promise: () => ({ Item: false }),
    });

    documentClientMock.put = () => ({
      promise: () => new Promise(resolve => resolve()),
    });

    documentClientMock.scan = () => ({
      promise: () =>
        new Promise(resolve =>
          resolve({
            Items: [
              {
                pk: 'case|101-20',
                sk: 'case|101-20',
              },
            ],
            LastEvaluatedKey: null,
          }),
        ),
    });
  });

  it('should skip running a migration when it already existed as a record in the deploy table', async () => {
    documentClientMock.get = () => ({
      promise: () => ({ Item: true }),
    });

    await handler(mockLambdaEvent);

    expect(mockLogger.debug).not.toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('runs any unran migrations', async () => {
    await handler(mockLambdaEvent);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('will throw an exception if items are invalid', async () => {
    failValidation = true;

    await expect(handler(mockLambdaEvent)).rejects.toThrow('fail');
  });

  it('logs a message if the item is successfully migrated to the destination table', async () => {
    failValidation = false;

    await handler(mockLambdaEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Successfully migrated case|101-20 case|101-20',
      {
        pk: 'case|101-20',
        recordSizeInBytes: expect.anything(),
        sk: 'case|101-20',
      },
    );
  });

  it('logs a message if the item already exist in the destination table', async () => {
    failValidation = false;
    documentClientMock.put = () => ({
      promise: () =>
        new Promise((resolve, reject) =>
          reject(new Error('The conditional request failed')),
        ),
    });

    await handler(mockLambdaEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'The item of case|101-20 case|101-20 already existed in the destination table, probably due to a live migration.  Skipping migration for this item.',
    );
    expect(mockLogger.info).not.toHaveBeenCalledWith(
      'Successfully migrated case|101-20 case|101-20',
      {
        pk: 'case|101-20',
        sk: 'case|101-20',
      },
    );
  });

  it('throw an error if an item could not be put into dynamo for some reason', async () => {
    failValidation = false;
    documentClientMock.put = () => ({
      promise: () =>
        new Promise((resolve, reject) =>
          reject(new Error('NOT a conditional request failed ERROR')),
        ),
    });

    await expect(handler(mockLambdaEvent)).rejects.toThrow(
      'NOT a conditional request failed ERROR',
    );
  });

  it('deletes the sqs event from the sqs queue when done', async () => {
    await handler(mockLambdaEvent);

    expect(deleteMessageMock).toHaveBeenCalled();
  });
});

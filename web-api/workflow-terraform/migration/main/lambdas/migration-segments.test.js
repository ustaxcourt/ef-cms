const deleteMessageMock = jest.fn().mockReturnValue({
  promise: () => Promise.resolve({}),
});
const SQSMock = class {
  constructor() {
    this.deleteMessage = deleteMessageMock;
  }
};

const documentClientMock = {
  get: null,
  put: null,
  scan: null,
};
const DynamoDBMock = class {
  constructor() {}
};
DynamoDBMock.DocumentClient = jest.fn().mockReturnValue(documentClientMock);
DynamoDBMock.Converter = {
  marshall: jest.fn().mockImplementation(item => item),
};

jest.mock('aws-sdk', () => {
  return { DynamoDB: DynamoDBMock, SQS: SQSMock };
});

jest.mock('promise-retry', () => cb => {
  return cb();
});

const mockGetRecordSize = jest.fn();
jest.mock('./utilities/getRecordSize', () => ({
  getRecordSize: mockGetRecordSize,
}));

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

const mockValidationMigration = jest.fn();
jest.mock('./migrations/0000-validate-all-items', () => ({
  migrateItems: mockValidationMigration,
}));

const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};
const mockApplicationContext = {
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

    mockValidationMigration.mockImplementation(items => items);
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

  it('should run a migration when it did NOT already exist as a record in the deploy table', async () => {
    await handler(mockLambdaEvent);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('should throw an error when any item is invalid', async () => {
    mockValidationMigration.mockRejectedValue(new Error());

    await expect(handler(mockLambdaEvent)).rejects.toThrow();
  });

  it('should log a message when an item is successfully migrated to the destination table', async () => {
    const mockRecordSize = 74;
    mockGetRecordSize.mockReturnValue(mockRecordSize);

    await handler(mockLambdaEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Successfully migrated case|101-20 case|101-20',
      {
        pk: 'case|101-20',
        recordSizeInBytes: mockRecordSize,
        sk: 'case|101-20',
      },
    );
  });

  it('should NOT throw an error when an error occurs while attempting to calculate a record`s size', async () => {
    mockGetRecordSize.mockImplementation(() => {
      throw new Error();
    });

    await handler(mockLambdaEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'DynamoDB Record Size Calculation Error: Error, {"pk":"case|101-20","sk":"case|101-20"}',
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Successfully migrated case|101-20 case|101-20',
      {
        pk: 'case|101-20',
        recordSizeInBytes: undefined,
        sk: 'case|101-20',
      },
    );
  });

  it('should logs a message when an item already existed in the destination table', async () => {
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

  it('should throw an error when an error occurs while saving an item into the destination table', async () => {
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

  it('should delete a message from the sqs queue when it is successfully processed', async () => {
    await handler(mockLambdaEvent);

    expect(deleteMessageMock).toHaveBeenCalled();
  });
});

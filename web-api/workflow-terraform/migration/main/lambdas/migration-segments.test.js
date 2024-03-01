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
jest.mock('../../../../src/applicationContext', () => {
  return {
    createApplicationContext: () => ({
      logger: mockLogger,
    }),
  };
});

import { handler } from './migration-segments';

describe('migration-segments', () => {
  const mockLambdaEvent = {
    Records: [
      {
        body: JSON.stringify({ segment: 0, totalSegments: 1 }),
        receiptHandle: 'abc',
      },
    ],
  };

  const mockLambdaContext = {
    awsRequestId: 'some-uuid',
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

    await handler(mockLambdaEvent, mockLambdaContext);

    expect(mockLogger.debug).not.toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('should run a migration when it did NOT already exist as a record in the deploy table', async () => {
    await handler(mockLambdaEvent, mockLambdaContext);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('should throw an error when any item is invalid', async () => {
    mockValidationMigration.mockRejectedValue(new Error());

    await expect(handler(mockLambdaEvent, mockLambdaContext)).rejects.toThrow();
  });

  it('should logs a message when an item already existed in the destination table', async () => {
    documentClientMock.put = () => ({
      promise: () =>
        new Promise((resolve, reject) =>
          reject(new Error('The conditional request failed')),
        ),
    });

    await handler(mockLambdaEvent, mockLambdaContext);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'The item of case|101-20 case|101-20 already existed in the destination table, probably due to a live migration.  Skipping migration for this item.',
    );
  });

  it('should throw an error when an error occurs while saving an item into the destination table', async () => {
    documentClientMock.put = () => ({
      promise: () =>
        new Promise((resolve, reject) =>
          reject(new Error('NOT a conditional request failed ERROR')),
        ),
    });

    await expect(handler(mockLambdaEvent, mockLambdaContext)).rejects.toThrow(
      'NOT a conditional request failed ERROR',
    );
  });

  it('should delete a message from the sqs queue when it is successfully processed', async () => {
    await handler(mockLambdaEvent, mockLambdaContext);

    expect(deleteMessageMock).toHaveBeenCalled();
  });

  it('should log the duration a segment took to process', async () => {
    await handler(mockLambdaEvent, mockLambdaContext);

    expect(mockLogger.info).toHaveBeenCalledWith('about to process segment', {
      segment: 0,
      totalSegments: 1,
    });
    expect(mockLogger.info).toHaveBeenCalledWith('finishing segment', {
      duration: expect.anything(),
      segment: 0,
      totalSegments: 1,
    });
  });
});

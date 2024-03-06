import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { handler } from './migration-segments';
import { migrateItems } from './migrations/0000-validate-all-items';
import { applicationContext as mockApplicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockClient } from 'aws-sdk-client-mock';
import type { Context } from 'aws-lambda';

const ddbMock = mockClient(DynamoDBDocumentClient);
const sqsMock = mockClient(SQSClient);

beforeEach(() => {
  ddbMock.reset();
  sqsMock.reset();
  // jest.resetAllMocks();
});
//swap out the applicationContext module used by migration-segments with our mocked version
jest.mock('../../../../src/applicationContext', () => {
  return {
    createApplicationContext: () => mockApplicationContext,
  };
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

jest.mock('./migrations/0000-validate-all-items', () => {
  return {
    migrateItems: jest.fn().mockImplementation(items => items),
  };
});

describe('migration-segments', () => {
  const mockLogger = mockApplicationContext.logger;
  beforeEach(() => {
    ddbMock.on(GetCommand).resolves({
      Item: false,
    });

    ddbMock.on(PutCommand).resolves({});
    ddbMock.on(ScanCommand).resolves({
      Items: [
        {
          pk: 'case|101-20',
          sk: 'case|101-20',
        },
      ],
      LastEvaluatedKey: undefined,
    });

    sqsMock.on(DeleteMessageCommand).resolves({});
  });

  const mockLambdaEvent = {
    Records: [
      {
        body: JSON.stringify({ segment: 0, totalSegments: 1 }),
        receiptHandle: 'abc',
      },
    ],
  };

  const mockLambdaContext: Context = {
    awsRequestId: 'some-uuid',
  } as Context;

  it('should skip running a migration when it already existed as a record in the deploy table', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: true,
    });

    await handler(mockLambdaEvent, mockLambdaContext, jest.fn());
    expect(migrateItems).toHaveBeenCalled();

    expect(mockLogger.debug).not.toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('should run a migration when it did NOT already exist as a record in the deploy table', async () => {
    await handler(mockLambdaEvent, mockLambdaContext, jest.fn());

    expect(mockLogger.debug).toHaveBeenCalledWith(
      'about to run migration just-a-test',
    );
  });

  it('should throw an error when any item is invalid', async () => {
    (migrateItems as jest.Mock).mockRejectedValueOnce(new Error());
    // mockValidationMigration.mockRejectedValue(new Error());

    await expect(handler(mockLambdaEvent, mockLambdaContext)).rejects.toThrow();
  });

  it('should logs a message when an item already existed in the destination table', async () => {
    ddbMock.on(PutCommand).rejects(new Error('The conditional request failed'));
    await handler(mockLambdaEvent, mockLambdaContext, jest.fn());

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

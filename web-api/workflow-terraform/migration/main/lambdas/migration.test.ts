import { Context } from 'aws-lambda';
import {
  DeleteCommand,
  DynamoDBDocument,
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { handler, processItems } from './migration';
import { marshall } from '@aws-sdk/util-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('migration', () => {
  const mockContext = {
    fail: jest.fn(),
    succeed: jest.fn(),
  } as unknown as Context;

  describe('handler', () => {
    beforeEach(() => {
      ddbMock.reset();
      ddbMock.on(DeleteCommand).resolves({});
    });

    it('deletes records that have an eventName of REMOVE', async () => {
      const deleteItem = {
        dynamodb: {
          OldImage: {
            pk: {
              S: 'case|123',
            },
            sk: {
              S: 'user|456',
            },
          },
        },
        eventName: 'REMOVE',
      };

      const putItem = {
        dynamodb: {
          NewImage: {
            pk: {
              S: 'case|123',
            },
            sk: {
              S: 'user|456',
            },
            value: {
              S: 'new',
            },
          },
          OldImage: {
            pk: {
              S: 'case|123',
            },
            sk: {
              S: 'user|456',
            },
            value: { S: 'old' },
          },
        },
        eventName: 'MODIFY',
      };

      const mockRecords = [deleteItem, putItem];

      await handler(
        {
          Records: mockRecords,
        },
        mockContext,
        () => {},
      );

      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });
  });

  describe('processItems', () => {
    beforeEach(() => {
      ddbMock.reset();
      ddbMock.on(PutCommand).resolves({});
    });

    it('migrates items and generates dynamodb PutRequest objects with the resulting data', async () => {
      const mockCase = marshall({
        ...MOCK_CASE,
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
      });
      const mockItems: Record<string, any>[] = [mockCase];
      const mockMigrateRecords = jest.fn().mockReturnValue(mockItems);
      const dynamodb = new DynamoDBClient({
        maxAttempts: 10,
        region: 'us-east-1',
      });

      const docClient = DynamoDBDocument.from(dynamodb, {
        marshallOptions: { removeUndefinedValues: true },
      });

      await processItems(applicationContext, {
        docClient,
        items: mockItems,
        migrateRecords: mockMigrateRecords,
      });

      expect(mockMigrateRecords).toHaveBeenCalledTimes(1);
    });
  });
});

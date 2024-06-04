import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocument,
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { marshall } from '@aws-sdk/util-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { processItems } from './migration';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('migration', () => {
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

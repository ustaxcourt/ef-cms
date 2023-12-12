import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  batchDelete,
  batchGet,
  remove as deleteObj,
  describeDeployTable,
  describeTable,
  get,
  getDeployTableName,
  getFromDeployTable,
  getTableName,
  put,
  putInDeployTable,
  query,
  queryFull,
  scan,
  update,
  updateConsistent,
  updateToDeployTable,
} from './dynamodbClientService';

describe('dynamodbClientService', function () {
  const MOCK_ITEM = {
    docketNumber: '123-20',
  };
  const dynamoDbTableName = 'efcms-local';

  const mockDynamoClient = {
    send: jest.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    applicationContext.getDocumentClient().batchGet.mockResolvedValue({
      Responses: {
        'efcms-local': [
          {
            'aws:rep:deleting': 'a',
            'aws:rep:updateregion': 'b',
            'aws:rep:updatetime': 'c',
            ...MOCK_ITEM,
          },
        ],
      },
    });

    applicationContext.getDocumentClient().get.mockResolvedValue({
      Item: {
        'aws:rep:deleting': 'a',
        'aws:rep:updateregion': 'b',
        'aws:rep:updatetime': 'c',
        ...MOCK_ITEM,
      },
    });

    applicationContext.getDocumentClient().delete.mockResolvedValue(null);

    applicationContext.getDocumentClient().put.mockResolvedValue(null);

    applicationContext.getDocumentClient().batchWrite.mockResolvedValue({});

    applicationContext.getDocumentClient().update.mockResolvedValue({
      Attributes: {
        id: MOCK_ITEM.docketNumber,
      },
    });

    applicationContext.getDocumentClient().updateConsistent.mockResolvedValue({
      id: MOCK_ITEM.docketNumber,
    });

    applicationContext.getDocumentClient().query.mockResolvedValue({
      Items: [
        {
          docketNumber: MOCK_ITEM.docketNumber,
        },
      ],
    });

    applicationContext.getDocumentClient().queryFull.mockResolvedValue({
      Items: [
        {
          docketNumber: MOCK_ITEM.docketNumber,
        },
      ],
    });

    applicationContext.getDocumentClient().scan.mockResolvedValue({
      Items: [
        {
          docketNumber: MOCK_ITEM.docketNumber,
        },
      ],
    });

    applicationContext.getDynamoClient = jest
      .fn()
      .mockImplementation(() => mockDynamoClient);
  });

  describe('getTableName', () => {
    let currentEnvironment;
    const testEnvironment = {
      appEndpoint: '',
      dynamoDbTableName: 'some-table',
      stage: 'local',
      tempDocumentsBucketName: 'some-temp-bucket',
    };

    beforeAll(() => {
      currentEnvironment = applicationContext.environment;
      applicationContext.getEnvironment = jest.fn().mockReturnValue({
        dynamoDbTableName: 'some-other-table',
      });
    });

    beforeEach(() => {
      applicationContext.environment = testEnvironment;
    });

    afterAll(() => {
      applicationContext.environment = currentEnvironment;
    });

    it('gets the table name based on the environment', () => {
      const tableName = getTableName({ applicationContext });
      expect(tableName).toBe('some-table');
    });

    it('gets the table name based on getEnvironment if application.environment is undefined', () => {
      applicationContext.environment = undefined!;
      const tableName = getTableName({ applicationContext });
      expect(tableName).toBe('some-other-table');
    });
  });

  describe('getDeployTableName', () => {
    let currentEnvironment;
    const testEnvironment = {
      appEndpoint: '',
      dynamoDbTableName: 'some-table',
      stage: 'local',
      tempDocumentsBucketName: 'some-temp-bucket',
    };

    beforeAll(() => {
      currentEnvironment = applicationContext.environment;
      applicationContext.getEnvironment = jest.fn().mockReturnValue({
        stage: 'other',
      });
    });

    beforeEach(() => {
      applicationContext.environment = testEnvironment;
    });

    afterAll(() => {
      applicationContext.environment = currentEnvironment;
    });

    it('returns environment.dynamoDbTableName if environment.stage is local', () => {
      const tableName = getDeployTableName({ applicationContext });
      expect(tableName).toBe('some-table');
    });

    it('falls back to getEnvironment() if applicationContext.environment is undefined if environment.stage is local', () => {
      applicationContext.environment = undefined!;
      const tableName = getDeployTableName({ applicationContext });
      expect(tableName).toBe('efcms-deploy-other');
    });

    it('returns the table name based on environment.stage if not local', () => {
      applicationContext.environment.stage = 'example';
      const tableName = getDeployTableName({ applicationContext });
      expect(tableName).toBe('efcms-deploy-example');
    });
  });

  describe('put', () => {
    it('should return the same Item property passed in in the params', async () => {
      const result = await put({
        Item: MOCK_ITEM,
        applicationContext,
      });
      expect(result).toEqual(MOCK_ITEM);
    });

    it('should filterEmptyStrings in params then return the same Item property passed in in the params', async () => {
      const result = await put({
        Item: MOCK_ITEM,
        applicationContext,
        fake: '',
      });
      expect(result).toEqual(MOCK_ITEM);
    });
  });

  describe('updateConsistent', () => {
    it('should return the same Item property passed in in the params', async () => {
      const result = await updateConsistent({ applicationContext });
      expect(result).toEqual({ id: MOCK_ITEM.docketNumber });
    });
  });

  describe('update', () => {
    it('should return undefined after the update was successful', async () => {
      const result = await update({
        Item: MOCK_ITEM,
        applicationContext,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('getDeployTable', () => {
    it('should return the deploy table name when the environment is NOT local', async () => {
      const mockEnvironment = 'exp99';
      applicationContext.environment.stage = mockEnvironment;

      applicationContext.getEnvironment.mockReturnValue({
        stage: mockEnvironment,
      });

      const result = await getDeployTableName({
        applicationContext,
      });

      expect(result).toEqual('efcms-deploy-exp99');
    });

    it('should return the regular dynamo table name when the environment is local', async () => {
      applicationContext.environment.dynamoDbTableName = dynamoDbTableName;
      applicationContext.environment.stage = 'local';

      const result = await getDeployTableName({
        applicationContext,
      });

      expect(result).toEqual(dynamoDbTableName);
    });
  });

  describe('updateToDeployTable', () => {
    it('should return the same Item property passed in in the params', async () => {
      const result = await updateToDeployTable({
        Item: MOCK_ITEM,
        applicationContext,
      });
      expect(result).toEqual(MOCK_ITEM);
    });
  });

  describe('get', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await get({ applicationContext });
      expect(result).toEqual(MOCK_ITEM);
    });
  });

  describe('getFromDeployTable', () => {
    const mockItem = {
      'aws:rep:updatetime': 'anytime',
      current: 'foobar',
      pk: 'foo',
      sk: 'bar',
    };

    const mockParams = {
      applicationContext,
      pk: mockItem.pk,
      sk: mockItem.sk,
    };

    const tableName = getDeployTableName({ applicationContext });

    beforeEach(() => {
      applicationContext.getDocumentClient({ useMainRegion: true }).get = jest
        .fn()
        .mockResolvedValue({ Item: mockItem });
    });

    it('uses the master region', async () => {
      await getFromDeployTable(mockParams);
      expect(applicationContext.getDocumentClient).toHaveBeenCalledWith({
        useMainRegion: true,
      });
    });

    it('gets the deploy table name', async () => {
      await getFromDeployTable(mockParams);

      expect(
        applicationContext.getDocumentClient({ useMainRegion: true }).get,
      ).toHaveBeenCalledWith({ TableName: tableName, ...mockParams });
    });

    it('removes the AWS Global Fields', async () => {
      const result = await getFromDeployTable(mockParams);
      expect(result['aws:rep:updatetime']).toBeUndefined();
      expect(result['pk']).toEqual(mockItem.pk);
      expect(result['sk']).toEqual(mockItem.sk);
      expect(result['current']).toEqual(mockItem.current);
    });
  });
  describe('query', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await query({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
    it('uses the ConsistentRead flag to query perform strongly consistent reads', async () => {
      const flags = [true, false];

      for (let i = 0; i < flags.length; i++) {
        const ConsistentRead = flags[i];
        await query({ ConsistentRead, applicationContext });
        expect(
          applicationContext.getDocumentClient().query.mock.calls[i][0],
        ).toMatchObject({ ConsistentRead });
      }
    });
    it('uses the optional FilterExpression parameter to perform a filtered query', async () => {
      await query({
        FilterExpression: 'single origin for me',
        applicationContext,
      });
      expect(
        applicationContext.getDocumentClient().query.mock.calls[0][0],
      ).toMatchObject({ FilterExpression: 'single origin for me' });
    });
    it('passes an undefined FilterExpression to perform an unfiltered query', async () => {
      await query({
        applicationContext,
      });
      expect(
        applicationContext.getDocumentClient().query.mock.calls[0][0],
      ).toMatchObject({ FilterExpression: undefined });
    });
  });

  describe('queryFull', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await queryFull({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
    it('uses the ConsistentRead flag to query perform strongly consistent reads', async () => {
      const flags = [true, false];

      for (let i = 0; i < flags.length; i++) {
        const ConsistentRead = flags[i];
        await queryFull({ ConsistentRead, applicationContext });
        expect(
          applicationContext.getDocumentClient().query.mock.calls[i][0],
        ).toMatchObject({ ConsistentRead });
      }
    });
    it('uses the optional FilterExpression parameter to perform a filtered query', async () => {
      await queryFull({
        FilterExpression: 'single origin for me',
        applicationContext,
      });
      expect(
        applicationContext.getDocumentClient().query.mock.calls[0][0],
      ).toMatchObject({ FilterExpression: 'single origin for me' });
    });
    it('passes an undefined FilterExpression to perform an unfiltered query', async () => {
      await queryFull({
        applicationContext,
      });
      expect(
        applicationContext.getDocumentClient().query.mock.calls[0][0],
      ).toMatchObject({ FilterExpression: undefined });
    });
  });

  describe('scan', () => {
    it('should return an array of items', async () => {
      const result = await scan({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
  });

  describe('batchGet', () => {
    it('should remove remove duplicates from keys array', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [
          {
            pk: MOCK_ITEM.docketNumber,
            sk: `caseWorksheet|${MOCK_ITEM.docketNumber}`,
          },
          {
            pk: MOCK_ITEM.docketNumber,
            sk: `caseWorksheet|${MOCK_ITEM.docketNumber}`,
          },
        ],
      });
      expect(
        applicationContext.getDocumentClient().batchGet.mock.calls[0][0]
          .RequestItems['efcms-local'].Keys.length,
      ).toEqual(1);
      expect(result).toEqual([MOCK_ITEM]);
    });

    it('should remove the global aws fields on the object returned', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [
          {
            pk: MOCK_ITEM.docketNumber,
            sk: `caseWorksheet|${MOCK_ITEM.docketNumber}`,
          },
        ],
      });
      expect(result).toEqual([MOCK_ITEM]);
    });
    it('should return empty array if no keys', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [],
      });
      expect(result).toEqual([]);
    });
  });

  describe('batchDelete', () => {
    it('should call client.batchWrite with the expected arguments', async () => {
      const item = {
        pk: MOCK_ITEM.docketNumber,
        sk: MOCK_ITEM.docketNumber,
        ...MOCK_ITEM,
      };

      await batchDelete({
        applicationContext,
        items: [item],
      });

      expect(
        applicationContext.getDocumentClient().batchWrite,
      ).toHaveBeenCalledTimes(1);
      expect(
        applicationContext.getDocumentClient().batchWrite.mock.calls[0][0],
      ).toEqual({
        RequestItems: {
          'efcms-local': [
            {
              DeleteRequest: {
                Key: {
                  pk: item.pk,
                  sk: item.sk,
                },
              },
            },
          ],
        },
      });
    });

    it('should retry call to client.batchWrite with any UnprocessedItems returned from the first batchWrite call', async () => {
      const items = [
        {
          pk: MOCK_ITEM.docketNumber,
          sk: MOCK_ITEM.docketNumber,
          ...MOCK_ITEM,
        },
        {
          pk: '345-20',
          sk: '345-20',
          ...MOCK_ITEM,
        },
      ];

      applicationContext.getDocumentClient().batchWrite.mockResolvedValueOnce({
        UnprocessedItems: [items[1]],
      });

      await batchDelete({
        applicationContext,
        items,
      });

      expect(
        applicationContext.getDocumentClient().batchWrite.mock.calls[0][0],
      ).toEqual({
        RequestItems: {
          'efcms-local': [
            {
              DeleteRequest: {
                Key: {
                  pk: items[0].pk,
                  sk: items[0].pk,
                },
              },
            },
            {
              DeleteRequest: {
                Key: {
                  pk: items[1].pk,
                  sk: items[1].pk,
                },
              },
            },
          ],
        },
      });
      expect(
        applicationContext.getDocumentClient().batchWrite.mock.calls[1][0],
      ).toEqual({
        RequestItems: {
          'efcms-local': [
            {
              DeleteRequest: {
                Key: {
                  pk: items[1].pk,
                  sk: items[1].pk,
                },
              },
            },
          ],
        },
      });
      expect(applicationContext.logger.error).not.toHaveBeenCalled();
    });

    it('should log an error if second attempt to batchWrite results in UnprocessedItems', async () => {
      const items = [
        {
          pk: MOCK_ITEM.docketNumber,
          sk: MOCK_ITEM.docketNumber,
          ...MOCK_ITEM,
        },
      ];

      applicationContext.getDocumentClient().batchWrite.mockResolvedValue({
        UnprocessedItems: items,
      });

      await batchDelete({
        applicationContext,
        items,
      });

      expect(applicationContext.logger.error).toHaveBeenCalled();
    });

    it('should NOT call client.batchWrite when items is undefined', async () => {
      await batchDelete({
        applicationContext,
        items: undefined,
      });

      expect(
        applicationContext.getDocumentClient().batchWrite,
      ).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should try to delete using the key passed in', async () => {
      await deleteObj({
        applicationContext,
        key: {
          pk: MOCK_ITEM.docketNumber,
        },
      });
      expect(
        applicationContext.getDocumentClient().delete.mock.calls[0][0],
      ).toEqual({
        Key: { pk: MOCK_ITEM.docketNumber },
        TableName: dynamoDbTableName,
      });
    });
  });

  describe('describeTable', () => {
    it("should return information on the environment's table", async () => {
      await describeTable({
        applicationContext,
      });

      expect(mockDynamoClient.send.mock.calls[0][0].input).toEqual(
        new DescribeTableCommand({ TableName: dynamoDbTableName }).input,
      );
    });
  });

  describe('describeDeployTable', () => {
    it("should return information on the environment's table", async () => {
      applicationContext.environment.stage = 'local';
      applicationContext.environment.dynamoDbTableName = dynamoDbTableName;

      await describeDeployTable({
        applicationContext,
      });

      expect(mockDynamoClient.send.mock.calls[0][0].input).toEqual(
        new DescribeTableCommand({ TableName: dynamoDbTableName }).input,
      );
    });
  });

  describe('putInDeployTable', () => {
    it('should write an item to the deploy table', async () => {
      applicationContext.environment.stage = 'local';
      applicationContext.environment.dynamoDbTableName = dynamoDbTableName;

      const dynamoRecord = {
        data: {
          allChecksHealthy: false,
          timeStamp: 20384938202,
        },
        pk: 'healthCheckValue',
        sk: 'healthCheckValue|us-west-1',
      };

      await putInDeployTable(applicationContext, dynamoRecord);

      expect(applicationContext.getDocumentClient().put).toHaveBeenCalledWith({
        Item: dynamoRecord,
        TableName: dynamoDbTableName,
      });
    });
  });
});

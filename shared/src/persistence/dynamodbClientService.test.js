const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const {
  batchDelete,
  batchGet,
  describeDeployTable,
  describeTable,
  get,
  getDeployTableName,
  put,
  query,
  queryFull,
  remove: deleteObj,
  scan,
  update,
  updateConsistent,
  updateToDeployTable,
} = require('./dynamodbClientService');

describe('dynamodbClientService', function () {
  const MOCK_ITEM = {
    docketNumber: '123-20',
  };

  const mockDynamoClient = {
    describeTable: jest.fn().mockImplementation(() => {
      return { promise: () => Promise.resolve(null) };
    }),
  };

  beforeEach(() => {
    applicationContext.getDocumentClient().batchGet.mockReturnValue({
      promise: () =>
        Promise.resolve({
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
        }),
    });

    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: {
            'aws:rep:deleting': 'a',
            'aws:rep:updateregion': 'b',
            'aws:rep:updatetime': 'c',
            ...MOCK_ITEM,
          },
        }),
    });

    applicationContext
      .getDocumentClient()
      .delete.mockReturnValue({ promise: () => Promise.resolve(null) });

    applicationContext
      .getDocumentClient()
      .batchWrite.mockReturnValue({ promise: () => Promise.resolve(null) });

    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          Attributes: {
            id: MOCK_ITEM.docketNumber,
          },
        });
      },
    });

    applicationContext.getDocumentClient().updateConsistent.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          id: MOCK_ITEM.docketNumber,
        });
      },
    });

    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          Items: [
            {
              docketNumber: MOCK_ITEM.docketNumber,
            },
          ],
        });
      },
    });

    applicationContext.getDocumentClient().queryFull.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          Items: [
            {
              docketNumber: MOCK_ITEM.docketNumber,
            },
          ],
        });
      },
    });

    applicationContext.getDocumentClient().scan.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          Items: [
            {
              docketNumber: MOCK_ITEM.docketNumber,
            },
          ],
        });
      },
    });

    applicationContext.getDynamoClient = jest
      .fn()
      .mockImplementation(() => mockDynamoClient);
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
    it('should return the same Item property passed in in the params', async () => {
      const result = await update({
        Item: MOCK_ITEM,
        applicationContext,
      });
      expect(result).toEqual(MOCK_ITEM);
    });
  });

  describe('getDeployTable', () => {
    it('should return the deploy table name when the environment is NOT local', async () => {
      const mockEnvironment = 'exp99';
      applicationContext.environment = {
        stage: mockEnvironment,
      };
      applicationContext.getEnvironment.mockReturnValue({
        stage: mockEnvironment,
      });

      const result = await getDeployTableName({
        applicationContext,
      });

      expect(result).toEqual('efcms-deploy-exp99');
    });

    it('should return the regular dynamo table name when the environment is local', async () => {
      applicationContext.environment = {
        dynamoDbTableName: 'efcms-local',
        stage: 'local',
      };

      const result = await getDeployTableName({
        applicationContext,
      });

      expect(result).toEqual('efcms-local');
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
    it('should throw an error if the item is not returned', async () => {
      applicationContext
        .getDocumentClient()
        .get.mockReturnValue({ promise: () => Promise.resolve({}) });
      const result = await get({ applicationContext });
      expect(result).toBeUndefined();
    });
  });

  describe('query', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await query({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
  });

  describe('queryFull', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await queryFull({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
  });

  describe('scan', () => {
    it('should return an array of items', async () => {
      const result = await scan({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
  });

  describe('batchGet', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [
          {
            pk: MOCK_ITEM.docketNumber,
          },
        ],
        tableName: 'a',
      });
      expect(result).toEqual([MOCK_ITEM]);
    });
    it('should return empty array if no keys', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [],
        tableName: 'a',
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

      applicationContext.getDocumentClient().batchWrite.mockReturnValueOnce({
        promise: () => ({
          UnprocessedItems: [items[1]],
        }),
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

      applicationContext.getDocumentClient().batchWrite.mockReturnValue({
        promise: () => ({
          UnprocessedItems: items,
        }),
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
        TableName: 'efcms-local',
      });
    });
  });

  describe('describeTable', () => {
    it("should return information on the environment's table", async () => {
      await describeTable({
        applicationContext,
      });

      expect(
        applicationContext.getDynamoClient().describeTable.mock.calls[0][0],
      ).toEqual({
        TableName: 'efcms-local',
      });
    });
  });

  describe('describeDeployTable', () => {
    it("should return information on the environment's table", async () => {
      applicationContext.environment = {
        dynamoDbTableName: 'efcms-local',
        stage: 'local',
      };

      await describeDeployTable({
        applicationContext,
      });

      expect(
        applicationContext.getDynamoClient().describeTable.mock.calls[0][0],
      ).toEqual({
        TableName: 'efcms-local',
      });
    });
  });
});

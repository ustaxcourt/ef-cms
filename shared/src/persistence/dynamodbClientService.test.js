const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const {
  batchDelete,
  batchGet,
  delete: deleteObj,
  describeDeployTable,
  describeTable,
  get,
  put,
  query,
  queryFull,
  updateConsistent,
} = require('./dynamodbClientService');

describe('dynamodbClientService', function () {
  const MOCK_ITEM = {
    docketNumber: '123-20',
  };

  const mockDynamoClient = {
    describeTable: jest.fn().mockImplementation(() => {
      return { promise: async () => null };
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
            id: '123-20',
          },
        });
      },
    });

    applicationContext.getDocumentClient().updateConsistent.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          id: '123-20',
        });
      },
    });

    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => {
        return Promise.resolve({
          Items: [
            {
              docketNumber: '123-20',
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
              docketNumber: '123-20',
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
  });

  describe('updateConsistent', () => {
    it('should return the same Item property passed in in the params', async () => {
      const result = await updateConsistent({ applicationContext });
      expect(result).toEqual({ id: '123-20' });
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

  describe('batchGet', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [
          {
            pk: '123-20',
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
        pk: '123-20',
        sk: '123-20',
        ...MOCK_ITEM,
      };

      await batchDelete({
        applicationContext,
        items: [item],
      });

      expect(applicationContext.getDocumentClient().batchWrite).toBeCalledTimes(
        1,
      );
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
          pk: '123-20',
          sk: '123-20',
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
      expect(applicationContext.logger.error).not.toBeCalled();
    });

    it('should log an error if second attempt to batchWrite results in UnprocessedItems', async () => {
      const items = [
        {
          pk: '123-20',
          sk: '123-20',
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

      expect(applicationContext.logger.error).toBeCalled();
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
          pk: '123-20',
        },
      });
      expect(
        applicationContext.getDocumentClient().delete.mock.calls[0][0],
      ).toEqual({
        Key: { pk: '123-20' },
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
      await describeDeployTable({
        applicationContext,
      });

      expect(
        applicationContext.getDynamoClient().describeTable.mock.calls[0][0],
      ).toEqual({
        TableName: 'efcms-deploy-local',
      });
    });
  });
});

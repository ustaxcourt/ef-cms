jest.mock('aws-sdk');
const AWS = require('aws-sdk');

const {
  batchGet,
  batchWrite,
  delete: deleteObj,
  get,
  put,
  query,
  updateConsistent,
} = require('./dynamodbClientService');

const MOCK_ITEM = {
  caseId: '123',
};

let documentClientStub;

describe('dynamodbClientService', function() {
  let applicationContext;
  let getStub = jest.fn().mockReturnValue({
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
  const deleteStub = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve(null) });
  const batchWriteStub = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve(null) });

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      environment: { stage: 'dev' },
      getDocumentClient: () => ({
        batchGet: jest.fn().mockReturnValue({
          promise: () =>
            Promise.resolve({
              Responses: {
                'efcms-dev': [
                  {
                    'aws:rep:deleting': 'a',
                    'aws:rep:updateregion': 'b',
                    'aws:rep:updatetime': 'c',
                    ...MOCK_ITEM,
                  },
                ],
              },
            }),
        }),
        batchWrite: batchWriteStub,
        delete: deleteStub,
        get: getStub,
        put: jest
          .fn()
          .mockReturnValue({ promise: () => Promise.resolve(null) }),
        query: jest.fn().mockReturnValue({
          promise: () =>
            Promise.resolve({
              Items: [
                {
                  'aws:rep:deleting': 'a',
                  'aws:rep:updateregion': 'b',
                  'aws:rep:updatetime': 'c',
                  ...MOCK_ITEM,
                },
              ],
            }),
        }),
        update: jest.fn().mockReturnValue({
          promise: () =>
            Promise.resolve({
              Attributes: {
                id: '123',
              },
            }),
        }),
      }),
    };

    AWS.DynamoDB = { DocumentClient: () => documentClientStub };
  });

  afterAll(() => {
    jest.restoreAllMocks();
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
    it('should return the  same Item property passed in in the params', async () => {
      const result = await updateConsistent({ applicationContext });
      expect(result).toEqual('123');
    });
  });

  describe('get', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await get({ applicationContext });
      expect(result).toEqual(MOCK_ITEM);
    });
    it('should throw an error if the item is not returned', async () => {
      getStub = jest
        .fn()
        .mockReturnValue({ promise: () => Promise.resolve({}) });
      const result = await get({ applicationContext });
      expect(result).toBeUndefined();
    });
    it('should return nothing if the promise is rejected', async () => {
      getStub = jest
        .fn()
        .mockReturnValue({ promise: () => Promise.reject({}) });
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

  describe('batchGet', () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await batchGet({
        applicationContext,
        keys: [
          {
            pk: '123',
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

  describe('batchWrite', () => {
    it('should call client.batchWrite with the expected arguments', async () => {
      const item = {
        pk: '123',
        sk: '123',
        ...MOCK_ITEM,
      };
      await batchWrite({
        applicationContext,
        items: [item],
        tableName: 'a',
      });
      expect(batchWriteStub.mock.calls[0][0]).toEqual({
        RequestItems: {
          'efcms-dev': [
            {
              PutRequest: {
                ConditionExpression:
                  'attribute_not_exists(#pk) and attribute_not_exists(#sk)',
                ExpressionAttributeNames: {
                  '#pk': item.pk,
                  '#sk': item.sk,
                },
                Item: item,
              },
            },
          ],
        },
      });
    });
  });

  describe('delete', () => {
    it('should try to delete using the key passed in', async () => {
      await deleteObj({
        applicationContext,
        key: {
          pk: '123',
        },
      });
      expect(deleteStub.mock.calls[0][0]).toEqual({
        Key: { pk: '123' },
        TableName: 'efcms-dev',
      });
    });
  });
});

const AWS = require('aws-sdk');
const sinon = require('sinon');

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

const applicationContext = {
  getDocumentClient: () => {
    return documentClientStub;
  },
};

describe('dynamodbClientService', function() {
  beforeEach(() => {
    documentClientStub = {
      batchGet: sinon.stub().returns({
        promise: () =>
          Promise.resolve({
            Responses: {
              a: [
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
      batchWrite: sinon
        .stub()
        .returns({ promise: () => Promise.resolve(null) }),
      delete: sinon.stub().returns({ promise: () => Promise.resolve(null) }),
      get: sinon.stub().returns({
        promise: () =>
          Promise.resolve({
            Item: {
              'aws:rep:deleting': 'a',
              'aws:rep:updateregion': 'b',
              'aws:rep:updatetime': 'c',
              ...MOCK_ITEM,
            },
          }),
      }),
      put: sinon.stub().returns({ promise: () => Promise.resolve(null) }),
      query: sinon.stub().returns({
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
      update: sinon.stub().returns({
        promise: () =>
          Promise.resolve({
            Attributes: {
              id: '123',
            },
          }),
      }),
    };
    sinon.stub(AWS.DynamoDB, 'DocumentClient').returns(documentClientStub);
  });

  afterEach(() => {
    AWS.DynamoDB.DocumentClient.restore();
  });

  describe('put', async () => {
    it('should return the same Item property passed in in the params', async () => {
      const result = await put({
        applicationContext,
        Item: MOCK_ITEM,
      });
      expect(result).toEqual(MOCK_ITEM);
    });
  });

  describe('updateConsistent', async () => {
    it('should return the  same Item property passed in in the params', async () => {
      const result = await updateConsistent({ applicationContext });
      expect(result).toEqual('123');
    });
  });

  describe('get', async () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await get({ applicationContext });
      expect(result).toEqual(MOCK_ITEM);
    });
    it('should throw an error if the item is not returned', async () => {
      documentClientStub.get.returns({ promise: () => Promise.resolve({}) });
      const result = await get({ applicationContext });
      expect(result).toBeUndefined();
    });
    it('should return nothing if the promise is rejected', async () => {
      documentClientStub.get.returns({ promise: () => Promise.reject({}) });
      const result = await get({ applicationContext });
      expect(result).toBeUndefined();
    });
  });

  describe('query', async () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await query({ applicationContext });
      expect(result).toEqual([MOCK_ITEM]);
    });
  });

  describe('batchGet', async () => {
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

  describe('batchWrite', async () => {
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
      expect(documentClientStub.batchWrite.getCall(0).args[0]).toEqual({
        RequestItems: {
          a: [
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

  describe('delete', async () => {
    it('should try to delete using the key passed in', async () => {
      await deleteObj({
        applicationContext,
        key: {
          pk: '123',
        },
        tableName: 'a',
      });
      expect(documentClientStub.delete.getCall(0).args[0]).toEqual({
        Key: { pk: '123' },
        TableName: 'a',
      });
    });
  });
});

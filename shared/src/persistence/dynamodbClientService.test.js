const AWS = require('aws-sdk');
const chai = require('chai');
const expect = require('chai').expect;
const sinon = require('sinon');

chai.use(require('chai-string'));

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
      put: sinon.stub().returns({ promise: () => Promise.resolve(null) }),
      update: sinon.stub().returns({
        promise: () =>
          Promise.resolve({
            Attributes: {
              id: '123',
            },
          }),
      }),
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
      delete: sinon.stub().returns({ promise: () => Promise.resolve(null) }),
      batchWrite: sinon
        .stub()
        .returns({ promise: () => Promise.resolve(null) }),
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
      expect(result).to.deep.equal(MOCK_ITEM);
    });
  });

  describe('updateConsistent', async () => {
    it('should return the  same Item property passed in in the params', async () => {
      const result = await updateConsistent({ applicationContext });
      expect(result).to.deep.equal('123');
    });
  });

  describe('get', async () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await get({ applicationContext });
      expect(result).to.deep.equal(MOCK_ITEM);
    });
    it('should throw an error if the item is not returned', async () => {
      documentClientStub.get.returns({ promise: () => Promise.resolve({}) });
      const result = await get({ applicationContext });
      expect(result).to.be.undefined;
    });
    it('should return nothing if the promise is rejected', async () => {
      documentClientStub.get.returns({ promise: () => Promise.reject({}) });
      const result = await get({ applicationContext });
      expect(result).to.be.undefined;
    });
  });

  describe('query', async () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await query({ applicationContext });
      expect(result).to.deep.equal([MOCK_ITEM]);
    });
  });

  describe('batchGet', async () => {
    it('should remove the global aws fields on the object returned', async () => {
      const result = await batchGet({
        applicationContext,
        tableName: 'a',
        keys: [
          {
            pk: '123',
          },
        ],
      });
      expect(result).to.deep.equal([MOCK_ITEM]);
    });
    it('should return empty array if no keys', async () => {
      const result = await batchGet({
        applicationContext,
        tableName: 'a',
        keys: [],
      });
      expect(result).to.deep.equal([]);
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
        tableName: 'a',
        items: [item],
      });
      expect(documentClientStub.batchWrite.getCall(0).args[0]).to.deep.equal({
        RequestItems: {
          a: [
            {
              PutRequest: {
                Item: item,
                ConditionExpression:
                  'attribute_not_exists(#pk) and attribute_not_exists(#sk)',
                ExpressionAttributeNames: {
                  '#pk': item.pk,
                  '#sk': item.sk,
                },
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
        tableName: 'a',
        key: {
          pk: '123',
        },
      });
      expect(documentClientStub.delete.getCall(0).args[0]).to.deep.equal({
        TableName: 'a',
        Key: { pk: '123' },
      });
    });
  });
});

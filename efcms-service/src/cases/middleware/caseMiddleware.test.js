const sinon = require('sinon');
const proxyquire =  require('proxyquire').noCallThru();

const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));

describe('create case', function() {

  const documents = [{ documentId: '123456789', documentType: 'stin' },{ documentId: '123456780', documentType: 'stin' },{ documentId: '123456781', documentType: 'stin' }]
  const stub = sinon.stub();
  const docketNumberStub = sinon.stub();
  let caseMiddleWare;
  let item;

  before(function() {
    item = {
      caseId: '123456',
      userId: 'userId',
      docketNumber: '456789-18',
      documents: [],
      createdAt: '2018-11-09T15:25:32.977Z',
    };

    stub.resolves(item);
    docketNumberStub.resolves('00123-18');

    process.env = {};
    process.env.STAGE = 'test';

    caseMiddleWare = proxyquire('./caseMiddleware', {
      '../../middleware/dynamodbClientService' : {
        put: stub
      },
      './docketNumberGenerator' : {
        createDocketNumber: docketNumberStub
      }
    });
  });


  it('should create a case', async () => {
    const result = await caseMiddleWare.create({
      userId: 'user',
      documents
    });
    expect(result).to.equal(item);
  });
});

describe('get cases', function() {

  const stub = sinon.stub();

  let caseMiddleWare;
  let item;

  describe('successes', () => {
    before(function() {
      item = {
        caseId: '123456',
        userId: 'user',
        docketNumber: '456789-18',
        documents: [],
        status: "new",
        createdAt: '2018-11-09T15:25:32.977Z',
      };

      stub.resolves([item]);

      caseMiddleWare = proxyquire('./caseMiddleware', {
        '../../middleware/dynamodbClientService' : {
          query: stub
        }
      });
    });

    it('should get all cases for a user', async () => {
      const result = await caseMiddleWare.getCases({
        userId: 'user'
      });
      expect(result[0]).to.equal(item);
    });

    it('should get a single case for a user', async () => {
      const result = await caseMiddleWare.getCase({
        userId: 'user',
        caseId: '123456'
      });
      expect(result).to.equal(item);
    });
  });

  describe('failures', () => {
    before(function() {
      stub.resolves([]);

      caseMiddleWare = proxyquire('./caseMiddleware', {
        '../../middleware/dynamodbClientService' : {
          query: stub
        }
      });
    });

    it('should throw a not found error if a single non-existent case', async () => {
      let error;
      try {
        await caseMiddleWare.getCase({
          userId: 'user',
          caseId: '123'
        });
      } catch (err) {
        error = err;
      }
      expect(error.message).to.equal('Case 123 was not found.');
    });
  });

});

describe('get cases by status', function() {

  const stub = sinon.stub();

  let caseMiddleWare;
  let item;

  before(function() {
    item = {
      caseId: '123456',
      userId: 'user',
      docketNumber: '456789-18',
      documents: [],
      status: "new",
      createdAt: '2018-11-09T15:25:32.977Z',
    };

    stub.resolves([item]);

    caseMiddleWare = proxyquire('./caseMiddleware', {
      '../../middleware/dynamodbClientService' : {
        query: stub
      }
    });
  });

  it('should get cases by query string status when user is authorized', async () => {
    const result = await caseMiddleWare.getCasesByStatus({
      status: 'NEW',
      userId: 'petitionsclerk'
    });
    expect(result[0]).to.equal(item);
  });

  it('should return an error if the user is authorized', async () => {
    let error;
    try {
      await caseMiddleWare.getCasesByStatus({
        status: 'NEW',
        userId: 'notapetitionsclerk'
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).to.equal('Unauthorized for getCasesByStatus');
  });

});
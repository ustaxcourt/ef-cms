const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const client = require('../../middleware/dynamodbClientService');

const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));

describe('get cases', function() {
  let caseMiddleWare;
  let item;

  describe('successes', () => {
    before(function() {
      item = {
        caseId: '123456',
        userId: 'user',
        docketNumber: '456789-18',
        documents: [],
        status: 'new',
        createdAt: '2018-11-09T15:25:32.977Z',
      };

      sinon.stub(client, 'query').resolves([item]);

      caseMiddleWare = proxyquire('./caseMiddleware', {});
    });

    after(() => {
      client.query.restore();
    });

    it('should get all cases for a user', async () => {
      const result = await caseMiddleWare.getCases({
        userId: 'user',
      });
      expect(result[0]).to.equal(item);
    });
  });
});

describe.skip('get case', function() {
  let caseMiddleWare;
  let item;

  describe('successes', () => {
    before(function() {
      item = {
        caseId: '123456',
        userId: 'user',
        docketNumber: '456789-18',
        documents: [],
        status: 'new',
        createdAt: '2018-11-09T15:25:32.977Z',
      };

      sinon.stub(client, 'get').resolves(item);

      caseMiddleWare = proxyquire('./caseMiddleware', {});
    });

    after(() => {
      client.get.restore();
    });

    it('should get a single case', async () => {
      const result = await caseMiddleWare.getCase({
        caseId: '123456',
        userId: 'user',
      });
      expect(result).to.equal(item);
    });
  });

  describe('failures', () => {
    describe('case not found', () => {
      before(function() {
        sinon.stub(client, 'get').resolves(null);
        caseMiddleWare = proxyquire('./caseMiddleware', {});
      });

      after(() => {
        client.get.restore();
      });

      it('should throw a not found error if a single non-existent case', async () => {
        let error;
        try {
          await caseMiddleWare.getCase({
            userId: 'user',
            caseId: '123',
          });
        } catch (err) {
          error = err;
        }
        expect(error.message).to.equal('Case 123 was not found.');
      });
    });

    describe('case different userid', () => {
      before(function() {
        sinon.stub(client, 'get').resolves({
          ...item,
          userId: '123',
        });
        caseMiddleWare = proxyquire('./caseMiddleware', {});
      });

      after(() => {
        client.get.restore();
      });

      it('should throw an error if user does not have access', async () => {
        let error;
        try {
          await caseMiddleWare.getCase({
            userId: 'abc',
            caseId: '123',
          });
        } catch (err) {
          error = err;
        }
        expect(error.message).to.equal('Unauthorized for getCase');
      });
    });
  });
});

describe('get cases by status', function() {
  let caseMiddleWare;
  let item;

  before(function() {
    item = {
      caseId: '123456',
      userId: 'user',
      docketNumber: '456789-18',
      documents: [],
      status: 'new',
      createdAt: '2018-11-09T15:25:32.977Z',
    };

    sinon.stub(client, 'query').resolves([item]);

    caseMiddleWare = proxyquire('./caseMiddleware', {});
  });

  after(() => {
    client.query.restore();
  });

  it('should get cases by query string status when user is authorized', async () => {
    const result = await caseMiddleWare.getCasesByStatus({
      status: 'NEW',
      userId: 'petitionsclerk',
    });
    expect(result[0]).to.equal(item);
  });

  it('should return an error if the user is authorized', async () => {
    let error;
    try {
      await caseMiddleWare.getCasesByStatus({
        status: 'NEW',
        userId: 'notapetitionsclerk',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).to.equal('Unauthorized for getCasesByStatus');
  });
});

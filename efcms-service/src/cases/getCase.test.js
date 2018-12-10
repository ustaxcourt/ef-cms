const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const getCase = require('./getCase');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-string'));
const { omit } = require('lodash');

const { MOCK_DOCUMENTS } = require('ef-cms-shared/src/test/mockDocuments');

describe('Get case lambda', function() {
  const MOCK_CASE = {
    userId: 'userId',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '56789-18',
    status: 'new',
    createdAt: new Date().toISOString(),
    documents: MOCK_DOCUMENTS,
  };

  describe('success - no cases exist in database', function() {
    beforeEach(function() {
      sinon.stub(client, 'get').resolves(null);
    });

    afterEach(function() {
      client.get.restore();
    });

    [
      {
        httpMethod: 'GET',
        pathParameters: {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        headers: { Authorization: 'Bearer userId' },
      },
    ].forEach(function(documentBody) {
      it('should return a `case not found` error', function() {
        return lambdaTester(getCase.get)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data).to.equal('Case c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.');
          });
      });
    });
  });

  describe('success - cases exist in database', function() {
    before(function() {
      sinon.stub(client, 'get').resolves(MOCK_CASE);
    });

    after(function() {
      client.get.restore();
    });

    [
      {
        httpMethod: 'GET',
        pathParameters: {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        headers: { Authorization: 'Bearer userId' },
      },
    ].forEach(function(documentBody) {
      it('should return a case on a GET', function() {
        return lambdaTester(getCase.get)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(omit(data, 'documents')).to.deep.equal(omit(MOCK_CASE, 'documents'));
          });
      });
    });
  });

  describe('error', function() {
    [
      {
        httpMethod: 'GET',
        headers: { Authorization: 'Bearer' },
      },
      {
        httpMethod: 'GET',
      },
    ].forEach(function(get) {
      it('should return an error on a GET without a Authorization header', function() {
        return lambdaTester(getCase.get)
          .event(get)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"Error:');
            expect(err.statusCode).to.equal(403);
          });
      });
    });
  });
});

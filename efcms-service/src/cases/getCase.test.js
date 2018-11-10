const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const getCase = require('./getCase');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Get case lambda', function() {
  const MOCK_CASE = {
    userId: 'userId',
    caseId: 'AAAAAAAA-AAAA-AAA-AAA-AAAAAAAAAAAA',
    docketNumber: '456789-18',
    createdAt: '',
  };

  describe ('success - no cases exist in database', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
        callback(null, {
          Items: []
        });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });

    [
      {
        httpMethod: 'GET',
        pathParameters: {
          caseId: '123'
        },
        headers: { 'Authorization': 'Bearer userId' }
      }
    ].forEach(function (documentBody) {
      it('should return a case on a GET', function () {
        return lambdaTester(getCase.get)
          .event(documentBody)
          .expectResult(result => {
            const data = JSON.parse(result.body);
            expect(data).to.equal('Case 123 was not found.');
          });
      });
    });
  });

  describe ('success - cases exist in database', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
        callback(null, {
          Items: [MOCK_CASE]
        });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });

    [
      {
        httpMethod: 'GET',
        pathParameters: {
          caseId: '123'
        },
        headers: { 'Authorization': 'Bearer userId' }
      }
    ].forEach(function (documentBody) {
      it('should return a case on a GET', function () {
        return lambdaTester(getCase.get)
          .event(documentBody)
          .expectResult(result => {
            const data = JSON.parse(result.body);
            expect(data).to.deep.equal(MOCK_CASE);
          });
      });
    });
  });

  describe('error', function() {
    [
      {
        httpMethod: 'GET',
        headers: {'Authorization': 'Bearer'}
      },
      {
        httpMethod: 'GET',
      },
    ].forEach(function(get) {
      it('should return an error on a GET without a Authorization header', function() {
        return lambdaTester(getCase.get)
          .event(get)
          .expectResult(err => {
            expect(err.body).to.startsWith('"Error:');
          });
      });
    });
  })
});

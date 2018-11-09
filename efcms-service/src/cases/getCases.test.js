const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const getCases = require('./getCases');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Get cases lambda', function() {

  const documents = [
    {
      documentId: '123456789',
      documentType: 'stin'
    },
    {
      documentId: '123456780',
      documentType: 'stin'
    },
    {
      documentId: '123456781',
      documentType: 'stin'
    }
  ];

  describe ('success', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
        callback(null, {
          Items: [{
            userId: 'userId',
            caseId: 'AAAAAAAA-AAAA-AAA-AAA-AAAAAAAAAAAA',
            docketNumber: '456789-18',
            documents,
            createdAt: '',
          }],
        });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });

    [
      {
        httpMethod: 'GET',
        headers: { 'Authorization': 'Bearer userId' }
      }
    ].forEach(function (documentBody) {
      it('should create a case on a GET', function () {
        return lambdaTester(getCases.get).
          event(documentBody).
          expectResult(result => {
            const data = JSON.parse(result.body);
            expect(data.length).to.equal(1);
          });
      });
    });
  });

  describe('error', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, {
          Item: {
            userId: 'userId',
            caseId: 'abc',
            docketNumber: '456789-18',
            documents: documents,
            createdAt: '',
          },
        });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });

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
        return lambdaTester(getCases.get)
        .event(get)
        .expectResult(err => {
          expect(err.body).to.startsWith('"Error:');
        });
      });
    });
  })
});

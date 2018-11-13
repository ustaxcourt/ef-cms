const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createCase = require('./createCase');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Create case lambda', function() {

  let documents = {
    documents: [
      {
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'stin'
      },
      {
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'stin'
      },
      {
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'stin'
      }
    ]
  };



  describe ('success', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
        callback(null, {
          Item: {
            userId: 'userId',
            docketNumber: '456789-18',
            documents: documents,
            createdAt: '',
          },
        });
      });
      aws.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
        callback(null, { Attributes: { id: 1 } });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });


    [
      {
        httpMethod: 'POST',
        body: JSON.stringify(documents),
        headers: { 'Authorization': 'Bearer userId' }
      }
    ].forEach(function (documentBody) {
      it('should create a case on a POST', function () {
        return lambdaTester(createCase.create)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data.userId)
              .to
              .equal('userId');
            expect(data.documents.length)
              .to
              .equal(3);
            expect(data.caseId).not.to.be.null;
            expect(data.caseId && /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(data.caseId)).to.be.true;

          });
      });
    });
  });

  describe('error', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
        callback(null, {
          Item: {
            userId: 'userId',
            docketNumber: '456789-18',
            documents: documents,
            createdAt: '',
          },
        });
      });
      aws.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
        callback(null, { Attributes: { id: 1 } });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });

    [
      {
        httpMethod: 'POST',
        body: JSON.stringify(documents),
        headers: {'Authorization': 'Bearer'}
      },
      {
        httpMethod: 'POST',
        body: JSON.stringify(documents.documents.pop())
      },
      {
        httpMethod: 'POST'
      }
    ].forEach(function(post) {
      it('should return an error on a POST without a Authorization header', function() {
        return lambdaTester(createCase.create)
          .event(post)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"Error:');
          });
      });
    });

    [
      {
        httpMethod: 'POST',
        body: JSON.stringify(documents),
        headers: {'Authorization': 'Bearer userId'}
      }
    ].forEach(function(post) {
      it('should return an error on a POST without the required case initiation documents', function() {
        return lambdaTester(createCase.create)
          .event(post)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"The case was invalid');
          });
      });
    });
  })
});

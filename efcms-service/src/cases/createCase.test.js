const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createCase = require('./createCase');
const chai = require('chai');
chai.use(require('chai-string'));

describe.only('Create case', function() {

  const documents = [{ documentId: '123456789', documentType: 'stin' },{ documentId: '123456780', documentType: 'stin' },{ documentId: '123456781', documentType: 'stin' }]


  before(function() {
    aws.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
      callback(null, {
        Item: {
          caseId: '123456',
          userId: 'userId',
          docketNumber: '456789-18',
          documents: [],
          createdAt: '',
        },
      });
    });
  });

  after(function() {
    aws.restore('DynamoDB.DocumentClient');
  });


  [
    {
      httpMethod: 'POST',
      body: JSON.stringify(documents)
    }
  ].forEach(function(documentBody) {
    it('should create a case on a POST', function() {
      return lambdaTester(createCase.create)
        .event(documentBody)
        .expectResult(result => {
          const data = JSON.parse(result.body);
          expect(data.caseId).to.not.be.null;
        });
    });
  });

  // [
  //   {
  //     httpMethod: 'POST',
  //     body: JSON.stringify({ userId: '123456789' }),
  //   },
  //   {
  //     httpMethod: 'POST',
  //     body: JSON.stringify({ documentType: 'petition' }),
  //   },
  //   {
  //     httpMethod: 'POST',
  //     body: JSON.stringify({ userId: '', documentType: 'petition' }),
  //   },
  //   {
  //     httpMethod: 'POST',
  //     body: JSON.stringify({ userId: '123456789', documentType: '' }),
  //   },
  //   {
  //     httpMethod: 'POST',
  //     body: JSON.stringify({ userId: null, documentType: 'petition' }),
  //   },
  //   {
  //     httpMethod: 'POST',
  //     body: JSON.stringify({ userId: '123456789', documentType: null }),
  //   },
  // ].forEach(function(documentBody) {
  //   it('should should require userId and documentType', function() {
  //     return lambdaTester(createCase.create)
  //       .event(documentBody)
  //       .expectResult(err => {
  //         expect(err.body).to.startsWith('"documentType and userId');
  //       });
  //   });
  // });
  //
  // [
  //   {
  //     httpMethod: 'POST',
  //     body: 'some string',
  //   },
  // ].forEach(function(documentBody) {
  //   it('should should throw an error if the body is not json', function() {
  //     return lambdaTester(createCase.create)
  //       .event(documentBody)
  //       .expectResult(err => {
  //         expect(err.body).to.startsWith('"problem parsing event body');
  //       });
  //   });
  // });
});

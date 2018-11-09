const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createDocument = require('./createDocument');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Create document', function() {
  before(function() {
    aws.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
      callback(null, {
        Item: {
          documentId: '000987654',
          userId: 'user',
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
      body: JSON.stringify({ userId: '123456789', documentType: 'stin' }),
      result: { documentType: 'stin', userId: '123456789' },
    },
    {
      httpMethod: 'POST',
      body: JSON.stringify({ userId: '123456789', documentType: 'petition' }),
      result: { documentType: 'petition', userId: '123456789' },
    },
  ].forEach(function(documentBody) {
    it('should create a document on a POST', function() {
      return lambdaTester(createDocument.create)
        .event(documentBody)
        .expectResult(result => {
          const data = JSON.parse(result.body);
          expect(data.documentType).to.equal(documentBody.result.documentType);
          expect(data.userId).to.equal(documentBody.result.userId);
        });
    });
  });

  [
    {
      httpMethod: 'POST',
      body: JSON.stringify({ userId: '123456789' }),
    },
    {
      httpMethod: 'POST',
      body: JSON.stringify({ documentType: 'petition' }),
    },
    {
      httpMethod: 'POST',
      body: JSON.stringify({ userId: '', documentType: 'petition' }),
    },
    {
      httpMethod: 'POST',
      body: JSON.stringify({ userId: '123456789', documentType: '' }),
    },
    {
      httpMethod: 'POST',
      body: JSON.stringify({ userId: null, documentType: 'petition' }),
    },
    {
      httpMethod: 'POST',
      body: JSON.stringify({ userId: '123456789', documentType: null }),
    },
  ].forEach(function(documentBody) {
    it('should should require userId and documentType', function() {
      return lambdaTester(createDocument.create)
        .event(documentBody)
        .expectResult(err => {
          expect(err.body).to.startsWith('"documentType and userId');
        });
    });
  });

  [
    {
      httpMethod: 'POST',
      body: 'some string',
    },
  ].forEach(function(documentBody) {
    it('should should throw an error if the body is not json', function() {
      return lambdaTester(createDocument.create)
        .event(documentBody)
        .expectResult(err => {
          expect(err.body).to.startsWith('"problem parsing event body');
        });
    });
  });
});

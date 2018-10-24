const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createDocument = require('createDocument');


describe('Create document', function() {

  before(function () {

    aws.mock('DynamoDB.DocumentClient', 'create', function (params, callback) {
      callback(null, {
        document: {
          pk: '000987654'
        },
      });
    });
  });

  after(function() {
    aws.restore('DynamoDB.DocumentClient');
  });

  it('should create a document on a POST', function() {
    return lambdaTester(createDocument.create)
    .event({httpMethod: 'POST'})
    .expectResult(result => {
      const data = JSON.parse(result.body);
      expect(data).to.exist;
    })
  });
});
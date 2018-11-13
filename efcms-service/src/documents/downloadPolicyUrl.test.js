const aws = require('aws-sdk');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const downloadPolicyUrl = require('./downloadPolicyUrl');
const chai = require('chai');
chai.use(require('chai-string'));
const sinon = require('sinon');

describe('downloadPolicyUrl', function() {
  let sandbox;
  before(function() {
    sandbox = sinon.createSandbox();
    process.env.DOCUMENTS_BUCKET_NAME = 'test';
    process.env.S3_ENDPOINT = 's3.us-east-1.amazonaws.com';
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should send back a policy url object on a GET', function() {
    const getSignedUrl = sandbox.stub(
      aws.S3.prototype,
      'getSignedUrl',
    );
    getSignedUrl.yields(null, "http://example.com");

    return lambdaTester(downloadPolicyUrl.get)
      .event({
        httpMethod: 'GET',
        pathParameters: {
          documentId: '123'
        }
      })
      .expectResolve(result => {
        expect(result.statusCode).to.equal(302);
        expect(result.headers.Location).to.equal("http://example.com")
      });
  });

  it('should return an error if S3 errors', function() {
    const getSignedUrl = sandbox.stub(
      aws.S3.prototype,
      'getSignedUrl',
    );
    getSignedUrl.yields(new Error('error'), { something: 'test' });

    return lambdaTester(downloadPolicyUrl.get)
      .event({
        httpMethod: 'GET',
        pathParameters: {
          documentId: '123'
        }
      })
      .expectResolve(err => {
        expect(err.body).to.startsWith('"error');
      });
  });
});

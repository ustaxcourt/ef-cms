const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const chai = require('chai');
chai.use(require('chai-string'));
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const getDownloadPolicyUrlStub = sinon.stub();
const downloadPolicyUrl = proxyquire('./downloadPolicyUrl', {
  '../applicationContext': {
    persistence: {
      getDownloadPolicyUrl: getDownloadPolicyUrlStub,
    },
  },
});

describe('downloadPolicyUrl', function() {
  it('should send back a policy url object on a GET', function() {
    getDownloadPolicyUrlStub.resolves({ url: 'http://example.com' });
    return lambdaTester(downloadPolicyUrl.get)
      .event({
        httpMethod: 'GET',
        pathParameters: {
          documentId: '123',
        },
      })
      .expectResolve(result => {
        expect(result.statusCode).to.equal(302);
        expect(result.headers.Location).to.equal('http://example.com');
      });
  });

  it('should return an error if S3 errors', function() {
    getDownloadPolicyUrlStub.rejects(new Error('error'));
    return lambdaTester(downloadPolicyUrl.get)
      .event({
        httpMethod: 'GET',
        pathParameters: {
          documentId: '123',
        },
      })
      .expectResolve(err => {
        expect(err.body).to.startsWith('"error');
      });
  });
});

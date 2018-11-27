const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const chai = require('chai');
chai.use(require('chai-string'));
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const MOCK_RESPONSE = {
  url: 'https://s3.us-east-1.amazonaws.com/test',
  fields: {
    bucket: 'test',
    'X-Amz-Algorithm': 'abc',
    'X-Amz-Credential': 'aa',
    'X-Amz-Date': '20181025T132750Z',
    'X-Amz-Security-Token': 'abc',
    Policy: 'gg',
    'X-Amz-Signature': '33',
  },
};

const createUploadPolicyStub = sinon.stub();
const createPolicyUrl = proxyquire('./createPolicyUrl', {
  '../applicationContext': {
    persistence: {
      createUploadPolicy: createUploadPolicyStub,
    },
  },
});

describe('Create policy url', function() {
  [
    {
      httpMethod: 'GET',
    },
  ].forEach(function(policyUrlResponse) {
    it('should create a policyUrlResponse on a GET', function() {
      createUploadPolicyStub.resolves(MOCK_RESPONSE);
      return lambdaTester(createPolicyUrl.create)
        .event(policyUrlResponse)
        .expectResolve(result => {
          const data = JSON.parse(result.body);
          expect(data.url).to.equal(MOCK_RESPONSE.url);
        });
    });

    it('should return an error if S3 errors', function() {
      createUploadPolicyStub.rejects(new Error('error'));
      return lambdaTester(createPolicyUrl.create)
        .event(policyUrlResponse)
        .expectResolve(err => {
          expect(err.body).to.startsWith('"error');
        });
    });
  });
});

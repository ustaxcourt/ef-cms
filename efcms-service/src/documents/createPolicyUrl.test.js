const aws = require('aws-sdk');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createPolicyUrl = require('./createPolicyUrl');
const chai = require('chai');
chai.use(require('chai-string'));
const sinon = require('sinon');

const MOCK_RESPONSE = {
  url: 'https://s3.us-east-1.amazonaws.com/test',
  fields: {
    bucket: 'test',
    'X-Amz-Algorithm': 'XXAWS4-HMAC-SHA256',
    'X-Amz-Credential':
      'XXASIAXQCLQG6GWOVBCCNV/20181025/us-east-1/s3/aws4_request',
    'X-Amz-Date': '20181025T132750Z',
    'X-Amz-Security-Token':
      'FQoGZXIvYXdzEBcaDLO82fBiCC2QCcT9MiL0AfTBP4LylkXLNh1CLskvs5rOkwhy4hSu4NIip+UMHNx9ASK0HXKk2QA3jb2ecz0UpaQT0vmutYbxjnrujduF5qH83BLr1u6seDvLvV4admv8zuWzn5kaFyXc00M6UrLLfttPVzhMA4YRYZWd8ueqasujFEpLu1NC1i3tsI7R4YPktNgXRsUd/R5LC4zDZ3NVL+fYG/cY+qhlLWfmo9m3NUOwrYflhbyi/IVzN4CvotGMLEMlUa0WkRZ6WE+RyzXnevCJzDe08p8G3axVAkXzXT6sBLPbXg4p4rdSrogcOqrrTN+wx4dKdrpUYUuAKZU8Ocd9YQ8o1YnH3gU=',
    Policy:
      'eyJleHBpcmF0aW9uIjoiMjAxOC0xMC0yNVQxNDoyNzo1MFoiLCJjb25kaXRpb25zIjpbWyJzdGFydHMtd2l0aCIsIiRrZXkiLCIiXSx7ImJ1Y2tldCI6ImVmY21zLWRvY3VtZW50cy13aWxsLXVzLWVhc3QtMSJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFTSUFYUUNMUUc2R1dPVkJDQ05WLzIwMTgxMDI1L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDE4MTAyNVQxMzI3NTBaIn0seyJYLUFtei1TZWN1cml0eS1Ub2tlbiI6IkZRb0daWEl2WVhkekVCY2FETE84MmZCaUNDMlFDY1Q5TWlMMEFmVEJQNEx5bGtYTE5oMUNMc2t2czVyT2t3aHk0aFN1NE5JaXArVU1ITng5QVNLMEhYS2syUUEzamIyZWN6MFVwYVFUMHZtdXRZYnhqbnJ1amR1RjVxSDgzQkxyMXU2c2VEdkx2VjRhZG12OHp1V3puNWthRnlYYzAwTTZVckxMZnR0UFZ6aE1BNFlSWVpXZDh1ZXFhc3VqRkVwTHUxTkMxaTN0c0k3UjRZUGt0TmdYUnNVZC9SNUxDNHpEWjNOVkwrZllHL2NZK3FobExXZm1vOW0zTlVPd3JZZmxoYnlpL0lWek40Q3ZvdEdNTEVNbFVhMFdrUlo2V0UrUnl6WG5ldkNKekRlMDhwOEczYXhWQWtYelhUNnNCTFBiWGc0cDRyZFNyb2djT3FyclROK3d4NGRLZHJwVVlVdUFLWlU4T2NkOVlROG8xWW5IM2dVPSJ9XX0=',
    'X-Amz-Signature':
      '2733d94d4c5d4305cd7c6be1acfa7005147a27565a28a9a6f00c93801379f339',
  },
};

describe('Create policy url', function() {
  let sandbox;
  before(function() {
    sandbox = sinon.createSandbox();
    process.env.DOCUMENTS_BUCKET_NAME = 'test';
    process.env.S3_ENDPOINT = 's3.us-east-1.amazonaws.com';
  });

  afterEach(function() {
    sandbox.restore();
  });

  [
    {
      httpMethod: 'GET',
    },
  ].forEach(function(policyUrlResponse) {
    it('should create a policyUrlResponse on a GET', function() {
      const createPresignedPost = sandbox.stub(
        aws.S3.prototype,
        'createPresignedPost',
      );
      createPresignedPost.yields(null, MOCK_RESPONSE);

      return lambdaTester(createPolicyUrl.create)
        .event(policyUrlResponse)
        .expectResolve(result => {
          const data = JSON.parse(result.body);
          expect(data.url).to.equal(MOCK_RESPONSE.url);
        });
    });

    it('should return an error if S3 errors', function() {
      const createPresignedPost = sandbox.stub(
        aws.S3.prototype,
        'createPresignedPost',
      );
      createPresignedPost.yields(new Error('error'), { something: 'test' });

      return lambdaTester(createPolicyUrl.create)
        .event(policyUrlResponse)
        .expectResolve(err => {
          expect(err.body).to.startsWith('"error');
        });
    });
  });
});

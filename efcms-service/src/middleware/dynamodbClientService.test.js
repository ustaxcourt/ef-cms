const sinon = require('sinon');

const service = require('./dynamodbClientService');
const AWSMock = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');

AWSMock.setSDKInstance(AWS_SDK);

const expect = require('chai').expect;

const chai = require('chai');
chai.use(require('chai-string'));

describe('Dynamodb client service', function() {

  const putStub = sinon.stub();
  const updateStub = sinon.stub();
  let item = null;

  before(function() {
   item = {
      Item: {
        someId: '123456',
      }
    };

    putStub.onCall(0).returns(item);
    updateStub.onCall(0).returns({Attributes: {id: 1}});

    AWSMock.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
      callback(null, putStub());
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
      callback(null, updateStub());
    });
  });

  after(function() {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should put an item', async () => {
    const result = await service.put(item);
    expect(putStub.called).to.be.true;
    expect(result.someId).to.not.be.null;

  });

  it('should update consistently', async () => {
    const result = await service.updateConsistent(item);
    expect(putStub.called).to.be.true;
    expect(result.someId).to.not.be.null;
  });
});

const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { associateUserWithCase } = require('./associateUserWithCase');

const applicationContext = {};

describe('associateUserWithCase', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves({
      pk: '123|case',
      sk: '234',
    });
  });

  afterEach(() => {
    client.put.restore();
  });

  it('should put item', async () => {
    const result = await associateUserWithCase({
      applicationContext,
      caseId: '234',
      userId: '123',
    });
    expect(result).toEqual({
      pk: '123|case',
      sk: '234',
    });
  });
});

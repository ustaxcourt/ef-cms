const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const {
  associateUserWithCasePending,
} = require('./associateUserWithCasePending');

const applicationContext = {};

describe('associateUserWithCasePending', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves({
      pk: '123|case|pending',
      sk: '123',
    });
  });

  afterEach(() => {
    client.put.restore();
  });

  it('should create mapping request that creates pending association request', async () => {
    const result = await associateUserWithCasePending({
      applicationContext,
      caseId: '123',
      userId: '123',
    });
    expect(result).toEqual({
      pk: '123|case|pending',
      sk: '123',
    });
  });
});

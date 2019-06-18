const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { verifyPendingCaseForUser } = require('./verifyPendingCaseForUser');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

const userId = '123';
const caseId = 'abc';

describe('verifyPendingCaseForUser', () => {
  afterEach(() => {
    client.query.restore();
  });

  it('should return true if mapping record for user to case exists', async () => {
    sinon.stub(client, 'query').resolves([
      {
        pk: '123|case|pending',
        sk: '098',
      },
    ]);
    const result = await verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
    expect(result).toEqual(true);
  });
  it('should return false if mapping record for user to case does not exist', async () => {
    sinon.stub(client, 'query').resolves([]);
    const result = await verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
    expect(result).toEqual(false);
  });
});

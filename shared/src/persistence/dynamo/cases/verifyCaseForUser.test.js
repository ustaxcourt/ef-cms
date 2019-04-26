const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { verifyCaseForUser } = require('./verifyCaseForUser');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

const userId = '123';
const caseId = 'abc';

describe('verifyCaseForUser', () => {
  afterEach(() => {
    client.query.restore();
  });

  it('should return true if mapping record for user to case exists', async () => {
    sinon.stub(client, 'query').resolves([
      {
        pk: '123|case',
        sk: '098',
      },
    ]);
    const result = await verifyCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
    expect(result).toEqual(true);
  });
  it('should return false if mapping record for user to case does not exist', async () => {
    sinon.stub(client, 'query').resolves([]);
    const result = await verifyCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
    expect(result).toEqual(false);
  });
});

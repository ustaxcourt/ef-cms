const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const {
  createCaseTrialSessionMappingRecord,
} = require('./createCaseTrialSessionMappingRecord');

const applicationContext = {};

describe('createCaseTrialSessionMappingRecord', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves({
      caseId: '234',
      pk: '123|trial-session',
      sk: '234',
    });
  });

  afterEach(() => {
    client.put.restore();
  });

  it('should persist mapping record to associate case with trial session', async () => {
    const result = await createCaseTrialSessionMappingRecord({
      applicationContext,
      caseId: '234',
      trialSessionId: '123',
    });
    expect(result).toEqual({
      caseId: '234',
      pk: '123|trial-session',
      sk: '234',
    });
  });
});

const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getTrialSessionWorkingCopy } = require('./getTrialSessionWorkingCopy');

describe('getTrialSessionWorkingCopy', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: 'trial-session-working-copy|123',
      sk: '456',
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '456',
    });
  });

  afterEach(() => {
    client.get.restore();
  });

  it('should get the trial session by id', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId: '123',
      userId: '456',
    });
    expect(result).toEqual({
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '456',
    });
  });
});

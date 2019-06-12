const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getTrialSessionById } = require('./getTrialSessionById');

describe('getTrialSessionById', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: 'trial-session-123',
      sk: 'trial-session-123',
      trialSessionId: '123',
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
    const result = await getTrialSessionById({
      applicationContext,
    });
    expect(result).toEqual({ trialSessionId: '123' });
  });
});

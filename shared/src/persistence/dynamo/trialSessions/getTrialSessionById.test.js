const client = require('../../dynamodbClientService');
const { getTrialSessionById } = require('./getTrialSessionById');

describe('getTrialSessionById', () => {
  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      pk: 'trial-session|123',
      sk: 'trial-session|123',
      trialSessionId: '123',
    });
  });

  it('should get the trial session by id', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getTrialSessionById({
      applicationContext,
      trialSessionId: '123',
    });
    expect(result).toEqual({
      pk: 'trial-session|123',
      sk: 'trial-session|123',
      trialSessionId: '123',
    });
  });
});

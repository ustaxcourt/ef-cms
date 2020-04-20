const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getTrialSessionWorkingCopy } = require('./getTrialSessionWorkingCopy');

describe('getTrialSessionWorkingCopy', () => {
  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      pk: 'trial-session-working-copy|123',
      sk: '456',
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '456',
    });
  });

  it('should get the trial session by id', async () => {
    const result = await getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId: '123',
      userId: '456',
    });
    expect(result).toEqual({
      pk: 'trial-session-working-copy|123',
      sk: '456',
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '456',
    });
  });
});

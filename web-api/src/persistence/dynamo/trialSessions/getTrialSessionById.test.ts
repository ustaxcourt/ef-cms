import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionById } from './getTrialSessionById';

jest.mock('../../dynamodbClientService', () => ({
  get: jest.fn().mockReturnValue({
    pk: 'trial-session|123',
    sk: 'trial-session|123',
    trialSessionId: '123',
  }),
}));

describe('getTrialSessionById', () => {
  it('should get the trial session by id', async () => {
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

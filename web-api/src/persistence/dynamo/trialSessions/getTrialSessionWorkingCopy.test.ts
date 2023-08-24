import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { get } from '../../dynamodbClientService';
import { getTrialSessionWorkingCopy } from './getTrialSessionWorkingCopy';

jest.mock('../../dynamodbClientService');

const getMock = get as jest.Mock;

getMock.mockReturnValue({
  pk: 'trial-session-working-copy|123',
  sk: '456',
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: '123',
  userId: '456',
});

describe('getTrialSessionWorkingCopy', () => {
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

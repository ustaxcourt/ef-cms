import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessions } from './getTrialSessions';

const mockTrialSessions = [
  {
    pk: 'trial-session|123',
  },
  {
    pk: 'trial-session|234',
  },
  {
    pk: 'trial-session|345',
  },
];

describe('getTrialSessions', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockResolvedValue({
      Items: mockTrialSessions,
    });
  });

  it('should get the trial sessions', async () => {
    const result = await getTrialSessions({
      applicationContext,
    });

    expect(result.length).toEqual(mockTrialSessions.length);
  });
});

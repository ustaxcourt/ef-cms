import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { TrialSession } from '../trialSessions/TrialSession';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('removeFromHearing', () => {
  it('removes the hearing from the case', () => {
    const trialSessionHearing = new TrialSession({
      isCalendared: true,
      judge: { name: 'Judge Buch' },
      maxCases: 100,
      sessionType: 'Regular',
      startDate: '2025-03-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Birmingham, Alabama',
    });
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        hearings: [trialSessionHearing],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    caseToUpdate.removeFromHearing(trialSessionHearing.trialSessionId);

    expect(caseToUpdate.hearings).toEqual([]);
  });
});

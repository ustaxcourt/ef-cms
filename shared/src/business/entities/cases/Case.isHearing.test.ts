import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { TrialSession } from '../trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('isHearing', () => {
  it('checks if the given trialSessionId is a hearing (true)', () => {
    const trialSessionHearing = new TrialSession(
      {
        isCalendared: true,
        judge: { name: 'Judge Buch' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        hearings: [trialSessionHearing],
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.isHearing(trialSessionHearing.trialSessionId)).toEqual(
      true,
    );
  });

  it('checks if the given trialSessionId is a hearing (false)', () => {
    const trialSessionHearing = new TrialSession(
      {
        isCalendared: true,
        judge: { name: 'Judge Buch' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );
    caseToUpdate.setAsCalendared(trialSessionHearing);

    expect(caseToUpdate.isHearing(trialSessionHearing.trialSessionId)).toEqual(
      false,
    );
  });
});

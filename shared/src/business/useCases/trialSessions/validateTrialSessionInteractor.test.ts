import { FORMATS, formatNow } from '../../utilities/DateHandler';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateTrialSessionInteractor } from './validateTrialSessionInteractor';

describe('validateTrialSessionInteractor', () => {
  it('returns a list of errors when the trial session is invalid', () => {
    const errors = validateTrialSessionInteractor(applicationContext, {
      trialSession: {} as RawTrialSession,
    });

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns null for a valid trial session', () => {
    const nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
    const MOCK_TRIAL = {
      maxCases: 100,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      startDate: `${nextYear}-12-01T00:00:00.000Z`,
      term: 'Fall',
      termYear: nextYear,
      trialLocation: 'Birmingham, Alabama',
    };

    const errors = validateTrialSessionInteractor(applicationContext, {
      trialSession: { ...MOCK_TRIAL } as RawTrialSession,
    });

    expect(errors).toEqual(null);
  });
});

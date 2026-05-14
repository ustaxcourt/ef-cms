import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { RawNewTrialSession } from '@shared/business/entities/trialSessions/NewTrialSession';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { validateTrialSessionInteractor } from '@web-client/business/useCases/trialSessions/validateTrialSessionInteractor';
import { RawEditTrialSession } from '@shared/business/entities/trialSessions/EditTrialSession';

describe('validateTrialSessionInteractor', () => {
  it('returns a list of errors when the edit trial session is invalid', () => {
    const errors = validateTrialSessionInteractor({
      trialSession: { trialSessionId: '123' } as RawEditTrialSession,
    });

    expect(Object.keys({ ...errors }).length).toBeGreaterThan(0);
  });

  it('returns a list of errors when the new trial session is invalid', () => {
    const errors = validateTrialSessionInteractor({
      trialSession: {} as RawNewTrialSession,
    });

    expect(Object.keys({ ...errors }).length).toBeGreaterThan(0);
  });

  it('returns null for a valid new trial session', () => {
    const nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
    const MOCK_TRIAL = {
      estimatedEndDate: `${nextYear}-12-05T00:00:00.000Z`,
      maxCases: 100,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.regular,
      startDate: `${nextYear}-12-01T00:00:00.000Z`,
      term: 'Fall',
      termYear: nextYear,
      trialLocation: 'Birmingham, Alabama',
    };

    const errors = validateTrialSessionInteractor({
      trialSession: { ...MOCK_TRIAL } as RawNewTrialSession,
    });

    expect(errors).toEqual(null);
  });
});

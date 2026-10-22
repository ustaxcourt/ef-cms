import { EditTrialSession } from './EditTrialSession';
import { NewTrialSession } from './NewTrialSession';
import {
  REPORTING_SESSION_EXCLUDED_FIELDS,
  TrialSession,
} from './TrialSession';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../EntityConstants';

const reportingSession = {
  ...MOCK_TRIAL_REGULAR,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
  startDate: '3000-12-01T00:00:00.000Z',
  estimatedEndDate: '3000-12-01T00:00:00.000Z',
  startTime: undefined,
};

describe.each([TrialSession, NewTrialSession, EditTrialSession])(
  '%s reporting validation',
  Entity => {
    it.each([
      SESSION_TYPES.regular,
      SESSION_TYPES.small,
      SESSION_TYPES.hybrid,
      SESSION_TYPES.hybridSmall,
    ])(
      'accepts a single-day reporting session with type %s and no time',
      sessionType => {
        const entity = new Entity({ ...reportingSession, sessionType });
        expect(entity.getFormattedValidationErrors()).toBeNull();
        expect(entity.startTime).toBeUndefined();
      },
    );

    it.each([SESSION_TYPES.special, SESSION_TYPES.motionHearing])(
      'rejects session type %s',
      sessionType => {
        expect(
          new Entity({
            ...reportingSession,
            sessionType,
          }).getFormattedValidationErrors(),
        ).toHaveProperty('sessionType');
      },
    );

    it.each([
      undefined,
      null,
      '3000-12-02T00:00:00.000Z',
      '3000-11-30T00:00:00.000Z',
    ])('rejects end date %s', estimatedEndDate => {
      expect(
        new Entity({
          ...reportingSession,
          estimatedEndDate,
        }).getFormattedValidationErrors(),
      ).toHaveProperty('estimatedEndDate');
    });

    it('rejects standalone sessions', () => {
      expect(
        new Entity({
          ...reportingSession,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        }).getFormattedValidationErrors(),
      ).toHaveProperty('sessionScope');
    });

    it.each([undefined, null, ''])(
      'requires a trial location (%s)',
      trialLocation => {
        expect(
          new Entity({
            ...reportingSession,
            trialLocation,
          }).getFormattedValidationErrors(),
        ).toHaveProperty('trialLocation');
      },
    );

    it.each(REPORTING_SESSION_EXCLUDED_FIELDS)(
      'rejects excluded field %s',
      field => {
        const value = ['trialClerk'].includes(field)
          ? { name: 'Trial Clerk', userId: MOCK_TRIAL_REGULAR.judge?.userId }
          : 'unexpected';
        expect(
          new Entity({
            ...reportingSession,
            [field]: value,
          }).getFormattedValidationErrors(),
        ).toHaveProperty(field);
      },
    );

    it('rejects swing designation', () => {
      expect(
        new Entity({
          ...reportingSession,
          swingSession: true,
        }).getFormattedValidationErrors(),
      ).toHaveProperty('swingSession');
    });
  },
);

describe('reporting session behavior', () => {
  it('cannot set an ordinary trial calendar', () => {
    const entity = new TrialSession(reportingSession);
    expect(entity.isReporting()).toBe(true);
    expect(entity.getEmptyFields()).toEqual([]);
    expect(entity.canSetAsCalendared()).toBe(false);
  });

  it('uses the existing eligible-case procedure and closure rules', () => {
    const entity = new TrialSession(reportingSession);
    expect(entity.getCaseProcedureForTrial()).toBe(SESSION_TYPES.regular);
    entity.removeCaseFromCalendar({
      docketNumber: MOCK_TRIAL_REGULAR.caseOrder[0].docketNumber,
      disposition: 'Removed',
    });
    expect(entity.isClosed()).toBe(true);
  });
});

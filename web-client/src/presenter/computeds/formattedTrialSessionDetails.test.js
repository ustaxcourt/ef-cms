import { TRIAL_SESSION_SCOPE_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from './formattedTrialSessionDetails';
import { omit } from 'lodash';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedTrialSessionDetails', () => {
  let mockTrialSession;

  const FUTURE_DATE = '2090-11-25T15:00:00.000Z';
  const PAST_DATE = '2000-11-25T15:00:00.000Z';
  const { TRIAL_SESSION_TYPES } = applicationContext.getConstants();
  const REGULAR_SESSION_TYPE = TRIAL_SESSION_TYPES.regular;
  const HYBRID_SESSION_TYPE = TRIAL_SESSION_TYPES.hybrid;

  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();

  const formattedTrialSessionDetails = withAppContextDecorator(
    formattedTrialSessionDetailsComputed,
    applicationContext,
  );

  const TRIAL_SESSION = {
    caseOrder: [],
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    eligibleCases: [],
    irsCalendarAdministrator: 'Test Calendar Admin',
    isCalendared: false,
    judge: { name: 'Test Judge' },
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'CT',
    term: 'Fall',
    termYear: '2019',
    trialClerk: { name: 'Test Trial Clerk' },
    trialLocation: 'Hartford, Connecticut',
  };

  beforeEach(() => {
    mockTrialSession = TRIAL_SESSION;

    applicationContext
      .getUtilities()
      .getFormattedTrialSessionDetails.mockImplementation(
        () => mockTrialSession,
      );
  });

  it('returns undefined if state.trialSession is undefined', () => {
    mockTrialSession = undefined;

    const result = runCompute(formattedTrialSessionDetails, {
      state: {},
    });
    expect(result).toBeUndefined();
  });

  it('should return false for isHybridSession when sessionType is set to Regular', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: REGULAR_SESSION_TYPE,
    };
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
      },
    });

    expect(result).toMatchObject({ isHybridSession: false });
  });

  it('should be true for isHybridSession when sessionType is set to Hybrid', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: HYBRID_SESSION_TYPE,
    };
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
      },
    });

    expect(result).toMatchObject({ isHybridSession: true });
  });

  it('should be false for disableHybridFilter when there is at least one case in formattedEligibleCases', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      eligibleCases: [
        {
          caseCaption: 'testPetitioner3, Petitioner',
          caseTitle: 'testPetitioner3',
          caseType: 'Deficiency',
          docketNumber: '101-20',
          docketNumberSuffix: 'S',
          docketNumberWithSuffix: '101-20S',
          entityName: 'EligibleCase',
          inConsolidatedGroup: false,
          irsPractitioners: [],
          isDocketSuffixHighPriority: true,
          leadCase: false,
          privatePractitioners: [],
          qcCompleteForTrial: {},
        },
      ],
      sessionType: HYBRID_SESSION_TYPE,
    };
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
      },
    });

    expect(result).toMatchObject({ disableHybridFilter: false });
  });

  it('should be true for disableHybridFilter when there are no cases in formattedEligibleCases', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: HYBRID_SESSION_TYPE,
    };
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
      },
    });

    expect(result).toMatchObject({ disableHybridFilter: true });
  });

  it('should NOT set canDelete, canEdit, or can canClose when the trial session does NOT have a start date', () => {
    mockTrialSession = omit(mockTrialSession, 'startDate');

    const result = runCompute(formattedTrialSessionDetails, {
      state: {},
    });

    expect(result.canEdit).toBeUndefined();
    expect(result.canDelete).toBeUndefined();
    expect(result.canClose).toBeUndefined();
  });

  describe('canDelete', () => {
    it('should be false when the trial session start date is in the past and it is NOT calendared', () => {
      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            isCalendared: false,
            startDate: PAST_DATE,
          },
        },
      });
      expect(result).toMatchObject({
        canDelete: false,
      });
    });

    it('should be false when the trial session start date is in the past and it is calendared', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        isCalendared: true,
        startDate: PAST_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result).toMatchObject({
        canDelete: false,
      });
    });

    it('should be true when the trial session start date is in the future and it is NOT calendared', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        isCalendared: false,
        startDate: FUTURE_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result).toMatchObject({
        canDelete: true,
      });
    });

    it('should be false when the trial session start date is in the future and it is calendared', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        isCalendared: true,
        startDate: FUTURE_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result).toMatchObject({
        canDelete: false,
      });
    });
  });

  describe('canEdit', () => {
    it('should be false when trial session start date is in the past and it is NOT closed', () => {
      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            sessionStatus: SESSION_STATUS_GROUPS.open,
            startDate: PAST_DATE,
          },
        },
      });
      expect(result).toMatchObject({
        canEdit: false,
      });
    });

    it('should be false when trial session start date is in the past and it is closed', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.closed,
        startDate: PAST_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result).toMatchObject({
        canEdit: false,
      });
    });

    it('should be true when trial session start date is in the future and it is NOT closed', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.open,
        startDate: FUTURE_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result).toMatchObject({
        canEdit: true,
      });
    });

    it('should be false when trial session start date is in the future and it is closed', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.closed,
        startDate: FUTURE_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result).toMatchObject({
        canEdit: false,
      });
    });
  });

  describe('canClose', () => {
    it('should be true if the session has no open cases, is standalone remote, and the trial date is in the past', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        caseOrder: [{ removedFromTrial: true }],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        startDate: PAST_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result.canClose).toBe(true);
    });

    it('should not set canClose if the trial date is in the future', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        caseOrder: [{ removedFromTrial: true }],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        startDate: FUTURE_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result.canClose).toBeUndefined();
    });

    it('should not set canClose if the session has open cases', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        caseOrder: [{ removedFromTrial: false }],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        startDate: PAST_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });
      expect(result.canClose).toBeUndefined();
    });

    it('should not set canClose if the session is not standalone remote', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        caseOrder: [],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
        startDate: PAST_DATE,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result.canClose).toBeUndefined();
    });
  });

  describe('showOpenCases', () => {
    it('should be true when the trial session is calendared and has open cases', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.open,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result.showOpenCases).toEqual(true);
    });
  });

  describe('showOnlyClosedCases', () => {
    it('should be true when the trial session is calendared and has no open cases', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.closed,
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
        },
      });

      expect(result.showOnlyClosedCases).toEqual(true);
    });
  });

  describe('chambersPhoneNumber', () => {
    it('should format the phone number if it exists and 10 digits exactly', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        chambersPhoneNumber: '1234567890',
      };

      const result = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...mockTrialSession,
          },
        },
      });

      expect(result.chambersPhoneNumber).toEqual('123-456-7890');
    });
  });
});

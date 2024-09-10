import {
  HYBRID_SESSION_TYPES,
  SESSION_STATUS_GROUPS,
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import {
  colvinsChambersUser,
  docketClerkUser,
  trialClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from './formattedTrialSessionDetails';
import { omit } from 'lodash';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedTrialSessionDetails', () => {
  let mockTrialSession;

  const FUTURE_DATE = '2090-11-25T15:00:00.000Z';
  const PAST_DATE = '2000-11-25T15:00:00.000Z';
  const REGULAR_SESSION_TYPE = SESSION_TYPES.regular;

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

  it('should return false for isHybridSession when sessionType is set to Regular', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: REGULAR_SESSION_TYPE,
    };
    const result: any = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
        user: trialClerkUser,
      },
    });

    expect(result).toMatchObject({ isHybridSession: false });
  });

  it('should be true for isHybridSession when sessionType is set to Hybrid or Hybrid-S', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: HYBRID_SESSION_TYPES.hybrid,
    };
    let result: any = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
        user: trialClerkUser,
      },
    });

    expect(result).toMatchObject({ isHybridSession: true });

    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: HYBRID_SESSION_TYPES.hybridSmall,
    };
    result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
        user: trialClerkUser,
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
          isLeadCase: false,
          privatePractitioners: [],
          qcCompleteForTrial: {},
        },
      ],
      sessionType: HYBRID_SESSION_TYPES[0],
    };
    const result: any = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
        user: trialClerkUser,
      },
    });

    expect(result).toMatchObject({ disableHybridFilter: false });
  });

  it('should be true for disableHybridFilter when there are no cases in formattedEligibleCases', () => {
    mockTrialSession = {
      ...TRIAL_SESSION,
      sessionType: HYBRID_SESSION_TYPES[1],
    };
    const result: any = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
        user: trialClerkUser,
      },
    });

    expect(result).toMatchObject({ disableHybridFilter: true });
  });

  it('should NOT set canDelete, canEdit, or canClose to true if the trial session does NOT have a start date', () => {
    mockTrialSession = omit(mockTrialSession, 'startDate');

    const result: any = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {},
        user: trialClerkUser,
      },
    });

    expect(result.canEdit).toBe(false);
    expect(result.canDelete).toBe(false);
    expect(result.canClose).toBe(false);
  });

  describe('canDelete', () => {
    it('should be false when the trial session start date is in the past and it is NOT calendared', () => {
      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            isCalendared: false,
            startDate: PAST_DATE,
          },
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
        },
      });

      expect(result).toMatchObject({
        canDelete: false,
      });
    });
  });

  describe('canEdit', () => {
    it('should be false when trial session start date is in the past and it is NOT closed', () => {
      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            sessionStatus: SESSION_STATUS_GROUPS.open,
            startDate: PAST_DATE,
          },
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
        },
      });

      expect(result).toMatchObject({
        canEdit: false,
      });
    });

    it('should be true when trial session start date is in the future, it is NOT closed, the user is not a chambers role', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.open,
        startDate: FUTURE_DATE,
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
        },
      });

      expect(result).toMatchObject({
        canEdit: true,
      });
    });

    describe('docketClerk user canEdit', () => {
      it('should be true when canEdit is true and docketClerk user is editing a Special TrialSession', () => {
        mockTrialSession = {
          ...TRIAL_SESSION,
          sessionStatus: SESSION_STATUS_GROUPS.open,
          sessionType: SESSION_TYPES.special,
          startDate: FUTURE_DATE,
        };

        const result: any = runCompute(formattedTrialSessionDetails, {
          state: {
            trialSession: {},
            user: docketClerkUser,
          },
        });

        expect(result).toMatchObject({
          canEdit: true,
        });
      });

      it('should be true when canEdit is true and docketClerk user is editing a Motion/Hearing TrialSession', () => {
        mockTrialSession = {
          ...TRIAL_SESSION,
          sessionStatus: SESSION_STATUS_GROUPS.open,
          sessionType: SESSION_TYPES.motionHearing,
          startDate: FUTURE_DATE,
        };

        const result: any = runCompute(formattedTrialSessionDetails, {
          state: {
            trialSession: {},
            user: docketClerkUser,
          },
        });

        expect(result).toMatchObject({
          canEdit: true,
        });
      });

      it('should be false when docketClerk user sees a non- Motion/Hearing or Special TrialSession', () => {
        mockTrialSession = {
          ...TRIAL_SESSION,
          sessionStatus: SESSION_STATUS_GROUPS.open,
          sessionType: SESSION_TYPES.hybrid,
          startDate: FUTURE_DATE,
        };

        const result: any = runCompute(formattedTrialSessionDetails, {
          state: {
            trialSession: {},
            user: docketClerkUser,
          },
        });

        expect(result).toMatchObject({
          canEdit: false,
        });
      });
    });

    it('should be false when trial session start date is in the future, it is NOT closed, the user is a chambers role', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.open,
        startDate: FUTURE_DATE,
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: colvinsChambersUser,
        },
      });

      expect(result).toMatchObject({
        canEdit: false,
      });
    });

    it('should be false when trial session start date is in the future and it is closed', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.closed,
        startDate: FUTURE_DATE,
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
        },
      });

      expect(result.canClose).toBe(false);
    });

    it('should not set canClose if the session has open cases', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        caseOrder: [{ removedFromTrial: false }],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        startDate: PAST_DATE,
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
        },
      });
      expect(result.canClose).toBe(false);
    });

    it('should not set canClose if the session is not standalone remote', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        caseOrder: [],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
        startDate: PAST_DATE,
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
        },
      });

      expect(result.canClose).toBe(false);
    });
  });

  describe('showOpenCases', () => {
    it('should be true when the trial session is calendared and has open cases', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_GROUPS.open,
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {},
          user: trialClerkUser,
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

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...mockTrialSession,
          },
          user: trialClerkUser,
        },
      });

      expect(result.chambersPhoneNumber).toEqual('123-456-7890');
    });
  });

  describe('NOTT reminder', () => {
    it('should set showAlertForNOTTReminder to true when the alert has not been previously dismissed and start date is within NOTT reminder range', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        dismissedAlertForNOTT: false,
        isCalendared: true,
        startDate: calculateISODate({ howMuch: 30, units: 'days' }),
        thirtyDaysBeforeTrialFormatted: '2/2/2022',
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...mockTrialSession,
          },
          user: trialClerkUser,
        },
      });

      expect(result.showAlertForNOTTReminder).toBe(true);
      expect(result.alertMessageForNOTT).toEqual(
        '30-day trial notices are due by 2/2/2022. Have notices been served?',
      );
    });

    it('should set showAlertForNOTTReminder to false when the alert has been previously dismissed', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        dismissedAlertForNOTT: true,
        isCalendared: true,
        startDate: calculateISODate({ howMuch: 30, units: 'days' }),
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...mockTrialSession,
          },
          user: trialClerkUser,
        },
      });

      expect(result.showAlertForNOTTReminder).toBe(false);
      expect(result.alertMessageForNOTT).toBeUndefined();
    });

    it('should set showAlertForNOTTReminder to false when start date is within NOTT reminder range', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        dismissedAlertForNOTT: true,
        isCalendared: true,
        startDate: calculateISODate({ howMuch: 60, units: 'days' }),
      };

      const result: any = runCompute(formattedTrialSessionDetails, {
        state: {
          trialSession: {
            ...mockTrialSession,
          },
          user: trialClerkUser,
        },
      });

      expect(result.showAlertForNOTTReminder).toBe(false);
      expect(result.alertMessageForNOTT).toBeUndefined();
    });

    it('should set showAlertForNOTTReminder to false when the trial session has been closed', () => {
      mockTrialSession = {
        ...TRIAL_SESSION,
        sessionStatus: SESSION_STATUS_TYPES.closed,
      };

      const { showAlertForNOTTReminder } = runCompute(
        formattedTrialSessionDetails,
        {
          state: {
            trialSession: {
              ...mockTrialSession,
            },
            user: trialClerkUser,
          },
        },
      );

      expect(showAlertForNOTTReminder).toBe(false);
    });
  });
});

import {
  DOCKET_NUMBER_SUFFIXES,
  HYBRID_SESSION_TYPES,
  SESSION_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../../shared/src/test/mockTrial';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionDetailsHelper as trialSessionDetailsHelperComputed } from './trialSessionDetailsHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('trialSessionDetailsHelper', () => {
  const mockEligibleCases = [
    MOCK_CASE,
    {
      ...MOCK_CASE,
      caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
      qcCompleteForTrial: { [`${MOCK_TRIAL_INPERSON.trialSessionId}`]: true },
    },
    {
      ...MOCK_CASE,
      caseCaption: undefined,
      docketNumber: '103-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      qcCompleteForTrial: { [`${MOCK_TRIAL_INPERSON.trialSessionId}`]: true },
    },
    {
      ...MOCK_CASE,
      caseCaption: undefined,
      docketNumber: '110-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY,
      qcCompleteForTrial: { [`${MOCK_TRIAL_INPERSON.trialSessionId}`]: true },
    },
    {
      ...MOCK_CASE,
      caseCaption: undefined,
      docketNumber: '111-19',
      qcCompleteForTrial: { [`${MOCK_TRIAL_INPERSON.trialSessionId}`]: true },
    },
  ];

  const trialSessionDetailsHelper = withAppContextDecorator(
    trialSessionDetailsHelperComputed,
    applicationContext,
  );

  describe('canDismissThirtyDayAlert', () => {
    it('should be true when the curent user has DISMISS_NOTT_REMINDER permissions', () => {
      const result = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { DISMISS_NOTT_REMINDER: true },
          trialSession: MOCK_TRIAL_INPERSON,
        },
      });

      expect(result.canDismissThirtyDayAlert).toEqual(true);
    });

    it('should be false when the curent user does NOT have DISMISS_NOTT_REMINDER permissions', () => {
      const result = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { DISMISS_NOTT_REMINDER: false },
          trialSession: MOCK_TRIAL_INPERSON,
        },
      });

      expect(result.canDismissThirtyDayAlert).toEqual(false);
    });
  });

  describe('eligibleRegularCaseQcTotalCompleteCount', () => {
    it('should return the number of eligible regular cases who have QC completed', () => {
      const { eligibleRegularCaseQcTotalCompleteCount } = runCompute(
        trialSessionDetailsHelper,
        {
          state: {
            permissions: { TRIAL_SESSION_QC_COMPLETE: true },
            trialSession: {
              ...MOCK_TRIAL_INPERSON,
              eligibleCases: mockEligibleCases,
            },
          },
        },
      );

      expect(eligibleRegularCaseQcTotalCompleteCount).toEqual(2);
    });
  });

  describe('eligibleSmallCaseQcTotalCompleteCount', () => {
    it('should return the number of eligible small cases who have QC completed', () => {
      const { eligibleSmallCaseQcTotalCompleteCount } = runCompute(
        trialSessionDetailsHelper,
        {
          state: {
            permissions: { TRIAL_SESSION_QC_COMPLETE: true },
            trialSession: {
              ...MOCK_TRIAL_INPERSON,
              eligibleCases: mockEligibleCases,
            },
          },
        },
      );

      expect(eligibleSmallCaseQcTotalCompleteCount).toEqual(2);
    });
  });

  describe('eligibleTotalCaseQcCompleteCount', () => {
    it('should return the total number of eligible cases with QC complete', () => {
      const { eligibleTotalCaseQcCompleteCount } = runCompute(
        trialSessionDetailsHelper,
        {
          state: {
            permissions: { TRIAL_SESSION_QC_COMPLETE: true },
            trialSession: {
              ...MOCK_TRIAL_INPERSON,
              eligibleCases: mockEligibleCases,
            },
          },
        },
      );

      expect(eligibleTotalCaseQcCompleteCount).toEqual(
        mockEligibleCases.length - 1,
      );
    });

    it('should return 0 when eligibleCases is not on the state', () => {
      const { eligibleTotalCaseQcCompleteCount } = runCompute(
        trialSessionDetailsHelper,
        {
          state: {
            permissions: { TRIAL_SESSION_QC_COMPLETE: true },
            trialSession: {
              ...MOCK_TRIAL_INPERSON,
              eligibleCases: undefined,
            },
          },
        },
      );

      expect(eligibleTotalCaseQcCompleteCount).toEqual(0);
    });
  });

  describe('nottReminderAction', () => {
    it('should be `Yes, Dismiss` when thirty day notices of trial have already been served for cases on the trial session', () => {
      const { nottReminderAction } = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { TRIAL_SESSION_QC_COMPLETE: true },
          trialSession: {
            ...MOCK_TRIAL_INPERSON,
            hasNOTTBeenServed: true,
          },
        },
      });

      expect(nottReminderAction).toEqual('Yes, Dismiss');
    });

    it('should be `Serve/Dismiss` when thirty day notices of trial have NOT been served for cases on the trial session', () => {
      const { nottReminderAction } = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { TRIAL_SESSION_QC_COMPLETE: true },
          trialSession: {
            ...MOCK_TRIAL_INPERSON,
            hasNOTTBeenServed: false,
          },
        },
      });

      expect(nottReminderAction).toEqual('Serve/Dismiss');
    });
  });

  describe('showQcComplete', () => {
    it('should return true when the user has TRIAL_SESSION_QC_COMPLETE permission', () => {
      const { showQcComplete } = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { TRIAL_SESSION_QC_COMPLETE: true },
          trialSession: MOCK_TRIAL_INPERSON,
        },
      });

      expect(showQcComplete).toEqual(true);
    });

    it('should return false when the user does not have TRIAL_SESSION_QC_COMPLETE permission', () => {
      const { showQcComplete } = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { TRIAL_SESSION_QC_COMPLETE: false },
          trialSession: MOCK_TRIAL_INPERSON,
        },
      });

      expect(showQcComplete).toEqual(false);
    });
  });

  describe('showSmallAndRegularQcComplete', () => {
    it('should return true when the user has TRIAL_SESSION_QC_COMPLETE permission and the trial session is a Hybrid type', () => {
      const { showSmallAndRegularQcComplete } = runCompute(
        trialSessionDetailsHelper,
        {
          state: {
            permissions: { TRIAL_SESSION_QC_COMPLETE: true },
            trialSession: {
              ...MOCK_TRIAL_INPERSON,
              sessionType: HYBRID_SESSION_TYPES.hybrid,
            },
          },
        },
      );

      expect(showSmallAndRegularQcComplete).toEqual(true);
    });

    it('should return false when the user does not have TRIAL_SESSION_QC_COMPLETE permission and the trial session is a Hybrid type', () => {
      const { showSmallAndRegularQcComplete } = runCompute(
        trialSessionDetailsHelper,
        {
          state: {
            permissions: { TRIAL_SESSION_QC_COMPLETE: false },
            trialSession: {
              ...MOCK_TRIAL_INPERSON,
              sessionType: HYBRID_SESSION_TYPES.hybridSmall,
            },
          },
        },
      );

      expect(showSmallAndRegularQcComplete).toEqual(false);
    });

    it('should return false when the user has TRIAL_SESSION_QC_COMPLETE permission and sessionType and the trial session is a Regular type', () => {
      const result = runCompute(trialSessionDetailsHelper, {
        state: {
          permissions: { TRIAL_SESSION_QC_COMPLETE: true },
          trialSession: {
            ...MOCK_TRIAL_INPERSON,
            sessionType: SESSION_TYPES.regular,
          },
        },
      });

      expect(result.showSmallAndRegularQcComplete).toEqual(false);
    });
  });
});

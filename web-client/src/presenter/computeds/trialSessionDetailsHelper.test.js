import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { trialSessionDetailsHelper } from './trialSessionDetailsHelper';

describe('trialSessionDetailsHelper', () => {
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

  const TRIAL_SESSION = {
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
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

  it('returns count of eligible cases with QC complete', () => {
    const result = runCompute(trialSessionDetailsHelper, {
      state: {
        permissions: { TRIAL_SESSION_QC_COMPLETE: true },
        trialSession: {
          ...TRIAL_SESSION,
          eligibleCases: [
            MOCK_CASE,
            {
              ...MOCK_CASE,
              caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              qcCompleteForTrial: { [TRIAL_SESSION.trialSessionId]: true },
            },
            {
              ...MOCK_CASE,
              caseCaption: undefined,
              docketNumber: '103-19',
              qcCompleteForTrial: { [TRIAL_SESSION.trialSessionId]: true },
            },
          ],
        },
      },
    });
    expect(result.eligibleCaseQcCompleteCount).toEqual(2);
  });

  it('returns eligibleCaseQcCompleteCount of 0 if eligibleCases is not on the state', () => {
    const result = runCompute(trialSessionDetailsHelper, {
      state: {
        permissions: { TRIAL_SESSION_QC_COMPLETE: true },
        trialSession: {
          ...TRIAL_SESSION,
        },
      },
    });
    expect(result.eligibleCaseQcCompleteCount).toEqual(0);
  });

  it('returns showQcComplete true if the user has TRIAL_SESSION_QC_COMPLETE permission', () => {
    const result = runCompute(trialSessionDetailsHelper, {
      state: {
        permissions: { TRIAL_SESSION_QC_COMPLETE: true },
        trialSession: {
          ...TRIAL_SESSION,
          eligibleCases: [],
        },
      },
    });
    expect(result.showQcComplete).toEqual(true);
  });

  it('returns showQcComplete false if the user does not have TRIAL_SESSION_QC_COMPLETE permission', () => {
    const result = runCompute(trialSessionDetailsHelper, {
      state: {
        permissions: { TRIAL_SESSION_QC_COMPLETE: false },
        trialSession: {
          ...TRIAL_SESSION,
          eligibleCases: [],
        },
      },
    });
    expect(result.showQcComplete).toEqual(false);
  });
});

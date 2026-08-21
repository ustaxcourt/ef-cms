import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionStartDateDifferencesAction } from './setTrialSessionStartDateDifferencesAction';

describe('setTrialSessionStartDateDifferencesAction', () => {
  const TEST_CURRENT_START_DATE = '2026-01-15';
  const TEST_UPDATED_START_DATE = '2026-02-20';

  const TEST_CURRENT_TRIAL_SESSION = {
    startDate: TEST_CURRENT_START_DATE,
  };

  const TEST_UPDATED_TRIAL_SESSION = {
    startDate: TEST_UPDATED_START_DATE,
  };

  it('should set state with the correct start date differences and persist modal flag', async () => {
    const { state } = await runAction(setTrialSessionStartDateDifferencesAction, {
      props: {
        currentTrialSession: TEST_CURRENT_TRIAL_SESSION,
        updatedTrialSession: TEST_UPDATED_TRIAL_SESSION,
        persistModal: true,
      },
    });

    expect(state.trialSessionStartDateChangeModalInfo).toEqual({
      currentTrialSessionStartDate: TEST_CURRENT_START_DATE,
      updatedTrialSessionStartDate: TEST_UPDATED_START_DATE,
    });
    expect(state.trialSessionChangeModalState).toEqual({
      persist: true,
    });
  });

  it('should set persist to false when persistModal is false', async () => {
    const { state } = await runAction(setTrialSessionStartDateDifferencesAction, {
      props: {
        currentTrialSession: TEST_CURRENT_TRIAL_SESSION,
        updatedTrialSession: TEST_UPDATED_TRIAL_SESSION,
        persistModal: false,
      },
    });

    expect(state.trialSessionChangeModalState).toEqual({
      persist: false,
    });
  });
});

import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { removeFromTrialSessionModalHelper as removeFromTrialSessionModalHelperComputed } from './removeFromTrialSessionModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('removeFromTrialSessionModalHelper', () => {
  let state;
  const removeFromTrialSessionModalHelper = withAppContextDecorator(
    removeFromTrialSessionModalHelperComputed,
    applicationContext,
  );

  beforeEach(() => {
    state = {
      caseDetail: {
        status: CASE_STATUS_TYPES.calendared,
        trialSessionId: 'abc-123',
      },
      modal: {
        caseStatus: CASE_STATUS_TYPES.submitted,
      },
    };
  });

  it('requires associatedJudge (and shows dropdown) when caseStatus is one that requires an associated judge', () => {
    const result = runCompute(removeFromTrialSessionModalHelper, {
      state,
    });

    expect(result.associatedJudgeRequired).toEqual(true);
    expect(result.showAssociatedJudgeDropdown).toEqual(true);
  });

  it('does not require associatedJudge when caseStatus is NOT one that requires an associated judge', () => {
    const result = runCompute(removeFromTrialSessionModalHelper, {
      state: {
        ...state,
        modal: { caseStatus: CASE_STATUS_TYPES.onAppeal },
      },
    });

    expect(result.associatedJudgeRequired).toEqual(false);
  });

  it('shows case status dropdown when a hearing is going to be removed and the case is NOT calendared', () => {
    state.modal.trialSessionId = 'abc-124';

    const result = runCompute(removeFromTrialSessionModalHelper, {
      state: {
        ...state,
        caseDetail: {
          status: CASE_STATUS_TYPES.assignedCase,
        },
      },
    });

    expect(result.showCaseStatusDropdown).toEqual(true);
  });
});

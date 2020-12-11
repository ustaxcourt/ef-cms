import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { removeFromTrialSessionModalHelper as removeFromTrialSessionModalHelperComputed } from './removeFromTrialSessionModalHelper';
import { runCompute } from 'cerebral/test';
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
        status: 'Calendared',
        trialSessionId: 'abc-123',
      },
      modal: {
        caseStatus: 'Submitted',
      },
    };
  });

  it('requires associatedJudge when caseStatus is one that requires an associated judge', () => {
    const result = runCompute(removeFromTrialSessionModalHelper, {
      state,
    });

    expect(result.associatedJudgeRequired).toEqual(true);
  });

  it('does not require associatedJudge when caseStatus is NOT one that requires an associated judge', () => {
    const result = runCompute(removeFromTrialSessionModalHelper, {
      state: {
        ...state,
        modal: { caseStatus: 'On Appeal' },
      },
    });

    expect(result.associatedJudgeRequired).toEqual(false);
  });

  it('uses current case status for defaultCaseStatus', () => {
    const result = runCompute(removeFromTrialSessionModalHelper, {
      state: {
        ...state,
      },
    });

    expect(result.defaultCaseStatus).toEqual('Calendared');
  });

  it('uses General Docket, Ready for Trial for defaultCaseStatus when the trialSessionId being removed is attached to the case', () => {
    state.modal.trialSessionId = 'abc-123';

    const result = runCompute(removeFromTrialSessionModalHelper, {
      state: {
        ...state,
      },
    });

    expect(result.defaultCaseStatus).toEqual(
      'General Docket - At Issue (Ready for Trial)',
    );
  });
});

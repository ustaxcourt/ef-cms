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
});

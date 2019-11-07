import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { updateCaseModalHelper as updateCaseModalHelperComputed } from './updateCaseModalHelper';
import { withAppContextDecorator } from '../../withAppContext';

const updateCaseModalHelper = withAppContextDecorator(
  updateCaseModalHelperComputed,
  applicationContext,
);

describe('updateCaseModalHelper', () => {
  it('returns showAssociatedJudgeOptions true if the selected status in the modal is Submitted', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        modal: {
          caseStatus: Case.STATUS_TYPES.submitted,
        },
      },
    });
    expect(result.showAssociatedJudgeOptions).toBeTruthy();
  });

  it('returns showAssociatedJudgeOptions false if the selected status in the modal is New', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        modal: {
          caseStatus: Case.STATUS_TYPES.new,
        },
      },
    });
    expect(result.showAssociatedJudgeOptions).toBeFalsy();
  });
});

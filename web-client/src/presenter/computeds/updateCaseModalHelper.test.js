import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { updateCaseModalHelper as updateCaseModalHelperComputed } from './updateCaseModalHelper';
import { withAppContextDecorator } from '../../withAppContext';

const updateCaseModalHelper = withAppContextDecorator(
  updateCaseModalHelperComputed,
  applicationContext,
);

let mockCase;

describe('updateCaseModalHelper', () => {
  beforeEach(() => {
    mockCase = {
      caseId: '123',
      status: Case.STATUS_TYPES.new,
    };
  });

  it('returns showAssociatedJudgeOptions true if the selected status in the modal is Submitted', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: mockCase,
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
        caseDetail: mockCase,
        modal: {
          caseStatus: Case.STATUS_TYPES.new,
        },
      },
    });
    expect(result.showAssociatedJudgeOptions).toBeFalsy();
  });

  it('returns showCalendaredAlert true if the case is currently calendared', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: { ...mockCase, status: Case.STATUS_TYPES.calendared },
      },
    });
    expect(result.showCalendaredAlert).toBeTruthy();
  });

  it('returns a filtered list of caseStatusOptions', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: mockCase,
      },
    });
    expect(result.caseStatusOptions).toEqual(Case.STATUS_TYPES_MANUAL_UPDATE);
  });
});

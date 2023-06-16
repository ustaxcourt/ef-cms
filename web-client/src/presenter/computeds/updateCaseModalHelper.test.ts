import {
  CASE_STATUS_TYPES,
  STATUS_TYPES_MANUAL_UPDATE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
      docketNumber: '123-20',
      status: CASE_STATUS_TYPES.new,
    };
  });

  it('returns showAssociatedJudgeOptions true if the selected status in the modal is Submitted', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: mockCase,
        modal: {
          caseStatus: CASE_STATUS_TYPES.submitted,
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
          caseStatus: CASE_STATUS_TYPES.new,
        },
      },
    });
    expect(result.showAssociatedJudgeOptions).toBeFalsy();
  });

  it('returns showCalendaredAlert true if the case is currently calendared', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: { ...mockCase, status: CASE_STATUS_TYPES.calendared },
      },
    });
    expect(result.showCalendaredAlert).toBeTruthy();
  });

  it('returns showCaseStatusDropdown true if the case is not currently calendared', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: { ...mockCase, status: CASE_STATUS_TYPES.new },
      },
    });
    expect(result.showCaseStatusDropdown).toBeTruthy();
  });

  it('returns showCaseStatusDropdown false if the case is currently calendared', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: { ...mockCase, status: CASE_STATUS_TYPES.calendared },
      },
    });
    expect(result.showCaseStatusDropdown).toBeFalsy();
  });

  it('returns a filtered list of caseStatusOptions', () => {
    const result = runCompute(updateCaseModalHelper, {
      state: {
        caseDetail: mockCase,
      },
    });
    expect(result.caseStatusOptions).toEqual(STATUS_TYPES_MANUAL_UPDATE);
  });
});

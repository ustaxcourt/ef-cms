import { clearTableItemValidationErrorAction } from '../actions/CaseWorksheet/clearTableItemValidationErrorAction';
import { setTableItemValidationErrorsAction } from '../actions/setTableItemValidationErrorsAction';
import { setUpdatedCaseInStateAction } from '../actions/CaseWorksheet/setUpdatedCaseInStateAction';
import { updateFinalBriefDueDateAction } from '@web-client/presenter/actions/CaseWorksheet/updateFinalBriefDueDateAction';
import { validateBriefDueDateAction } from '@web-client/presenter/actions/CaseWorksheet/validateBriefDueDateAction';

export const updateFinalBriefDueDateSequence = [
  validateBriefDueDateAction,
  {
    error: [setTableItemValidationErrorsAction],
    success: [
      clearTableItemValidationErrorAction,
      updateFinalBriefDueDateAction,
      setUpdatedCaseInStateAction,
    ],
  },
];

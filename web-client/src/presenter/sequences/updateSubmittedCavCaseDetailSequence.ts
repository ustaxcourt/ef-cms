import { clearTableItemValidationErrorAction } from '../actions/CaseWorksheet/clearTableItemValidationErrorAction';
import { setTableItemValidationErrorsAction } from '../actions/setTableItemValidationErrorsAction';
import { setUpdatedCaseInStateAction } from '../actions/CaseWorksheet/setUpdatedCaseInStateAction';
import { updateSubmittedCavCaseDetailAction } from '../actions/CaseWorksheet/updateSubmittedCavCaseDetailAction';
import { validateSubmittedCavCaseBriefDueDateAction } from '../actions/CaseWorksheet/validateSubmittedCavCaseBriefDueDateAction';

export const updateSubmittedCavCaseDetailSequence = [
  validateSubmittedCavCaseBriefDueDateAction,
  {
    error: [setTableItemValidationErrorsAction],
    success: [
      clearTableItemValidationErrorAction,
      updateSubmittedCavCaseDetailAction,
      setUpdatedCaseInStateAction,
    ],
  },
];

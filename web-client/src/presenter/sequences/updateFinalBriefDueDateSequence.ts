import { clearTableItemValidationErrorAction } from '../actions/CaseWorksheet/clearTableItemValidationErrorAction';
import { setCaseWorksheetAction } from '../actions/CaseWorksheet/setCaseWorksheetAction';
import { setTableItemValidationErrorsAction } from '../actions/setTableItemValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { updateFinalBriefDueDateAction } from '@web-client/presenter/actions/CaseWorksheet/updateFinalBriefDueDateAction';
import { validateBriefDueDateAction } from '@web-client/presenter/actions/CaseWorksheet/validateBriefDueDateAction';

export const updateFinalBriefDueDateSequence = [
  validateBriefDueDateAction,
  {
    error: [setTableItemValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearTableItemValidationErrorAction,
      updateFinalBriefDueDateAction,
      setCaseWorksheetAction,
    ]),
  },
];

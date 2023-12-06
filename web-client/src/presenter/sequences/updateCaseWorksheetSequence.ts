import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseWorksheetAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCaseWorksheetAction } from '@web-client/presenter/actions/CaseWorksheet/updateCaseWorksheetAction';
import { validateCaseWorksheetAction } from '../actions/validateCaseWorksheetAction';

export const updateCaseWorksheetSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCaseWorksheetAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearModalAction,
      stopShowValidationAction,
      clearAlertsAction,
      updateCaseWorksheetAction,
      setCaseWorksheetAction,
      clearModalStateAction,
      clearFormAction,
    ]),
  },
];

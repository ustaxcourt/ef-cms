import { clearAlertsAction } from '../actions/clearAlertsAction';
import { expireSaveSuccessAction } from '../actions/expireSaveSuccessAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setSaveSuccessAction } from '../actions/setSaveSuccessAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const submitCaseDetailEditSaveSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      updateCaseAction,
      setCaseAction,
      setSaveSuccessAction,
      expireSaveSuccessAction,
    ],
  },
  unsetFormSubmittingAction,
];

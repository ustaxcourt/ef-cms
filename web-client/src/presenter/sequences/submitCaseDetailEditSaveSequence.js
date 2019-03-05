import { clearAlertsAction } from '../actions/clearAlertsAction';
import { expireFormSaveSuccessAction } from '../actions/expireFormSaveSuccessAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSaveSuccessAction } from '../actions/setFormSaveSuccessAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const submitCaseDetailEditSaveSequence = [
  clearAlertsAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      updateCaseAction,
      setCaseAction,
      setFormSaveSuccessAction,
      expireFormSaveSuccessAction,
    ],
  },
];

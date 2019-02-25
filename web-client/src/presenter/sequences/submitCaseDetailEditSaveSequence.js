import { clearAlertsAction } from '../actions/clearAlertsAction';
import { expireFormSaveSuccess } from '../actions/expireFormSaveSuccessAction';
import { getFormCombinedWithCaseDetail } from '../actions/getFormCombinedWithCaseDetailAction';
import { setCase } from '../actions/setCaseAction';
import { setFormSaveSuccess } from '../actions/setFormSaveSuccessAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { updateCase } from '../actions/updateCaseAction';
import { validateCaseDetail } from '../actions/validateCaseDetailAction';

export const submitCaseDetailEditSaveSequence = [
  clearAlertsAction,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [updateCase, setCase, setFormSaveSuccess, expireFormSaveSuccess],
    error: [setValidationAlertErrorsAction],
  },
];

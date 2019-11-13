import { clearAlertsAction } from '../actions/clearAlertsAction';
import { expireSaveSuccessAction } from '../actions/expireSaveSuccessAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveSuccessAction } from '../actions/setSaveSuccessAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const submitCaseDetailEditSaveSequence = [
  setWaitingForResponseAction,
  clearAlertsAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      saveCaseDetailInternalEditAction,
      setCaseAction,
      setSaveSuccessAction,
      expireSaveSuccessAction,
    ],
  },
  unsetWaitingForResponseAction,
];

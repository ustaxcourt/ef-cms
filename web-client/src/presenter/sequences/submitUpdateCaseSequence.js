import clearAlerts from '../actions/clearAlertsAction';
import expireFormSaveSuccess from '../actions/expireFormSaveSuccessAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import setFormSaveSuccess from '../actions/setFormSaveSuccessAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import updateCase from '../actions/updateCaseAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [
      updateCase,
      {
        error: [setAlertError],
        success: [
          setCase,
          setAlertSuccess,
          setFormSaveSuccess,
          expireFormSaveSuccess,
        ],
      },
    ],
    error: [setValidationAlertErrorsAction],
  },
];

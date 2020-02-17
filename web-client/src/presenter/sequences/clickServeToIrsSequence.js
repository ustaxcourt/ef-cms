import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const clickServeToIrsSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      saveCaseDetailInternalEditAction,
      setShowModalFactoryAction('ServeToIrsModalDialog'),
    ],
  },
]);

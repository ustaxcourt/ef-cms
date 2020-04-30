import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { refreshPdfSequence } from './refreshPdfSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCreateOrderModalDataOnFormAction } from '../actions/CourtIssuedOrder/setCreateOrderModalDataOnFormAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateOrderWithoutBodyAction } from '../actions/CourtIssuedOrder/validateOrderWithoutBodyAction';

export const submitEditOrderTitleModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateOrderWithoutBodyAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      clearModalAction,
      setCreateOrderModalDataOnFormAction,
      refreshPdfSequence,
    ],
  },
];

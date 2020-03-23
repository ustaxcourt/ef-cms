import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCreateOrderAction } from '../actions/CourtIssuedOrder/navigateToCreateOrderAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateOrderWithoutBodyAction } from '../actions/CourtIssuedOrder/validateOrderWithoutBodyAction';

export const submitCreateOrderModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateOrderWithoutBodyAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      clearModalAction,
      setCurrentPageAction('Interstitial'),
      setCasePropFromStateAction,
      navigateToCreateOrderAction,
    ],
  },
];

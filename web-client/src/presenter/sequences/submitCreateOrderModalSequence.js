import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCreateOrderAction } from '../actions/CourtIssuedOrder/navigateToCreateOrderAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { stashCreateOrderModalDataAction } from '../actions/CourtIssuedOrder/stashCreateOrderModalDataAction';
import { state } from 'cerebral';
import { validateOrderWithoutBodyAction } from '../actions/CourtIssuedOrder/validateOrderWithoutBodyAction';

export const submitCreateOrderModalSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  validateOrderWithoutBodyAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      clearModalAction,
      setCurrentPageAction('Interstitial'),
      stashCreateOrderModalDataAction,
      setCasePropFromStateAction,
      navigateToCreateOrderAction,
    ],
  },
];

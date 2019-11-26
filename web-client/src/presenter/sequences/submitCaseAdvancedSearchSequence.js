import { clearAlertsAction } from '../actions/clearAlertsAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitCaseAdvancedSearchAction } from '../actions/AdvancedSearch/submitCaseAdvancedSearchAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAdvancedSearchAction } from '../actions/AdvancedSearch/validateAdvancedSearchAction';

export const submitCaseAdvancedSearchSequence = [
  validateAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      unset(state.searchResults),
    ],
    success: [
      clearAlertsAction,
      setWaitingForResponseAction,
      submitCaseAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
      unsetWaitingForResponseAction,
    ],
  },
];

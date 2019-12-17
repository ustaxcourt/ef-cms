import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearDocketNumberSearchFormAction } from '../actions/clearDocketNumberSearchFormAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitCaseAdvancedSearchAction } from '../actions/AdvancedSearch/submitCaseAdvancedSearchAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateCaseAdvancedSearchAction } from '../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitCaseAdvancedSearchSequence = [
  clearSearchTermAction,
  clearDocketNumberSearchFormAction,
  validateCaseAdvancedSearchAction,
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

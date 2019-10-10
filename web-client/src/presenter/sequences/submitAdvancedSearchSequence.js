import { clearAlertsAction } from '../actions/clearAlertsAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitAdvancedSearchAction } from '../actions/AdvancedSearch/submitAdvancedSearchAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAdvancedSearchAction } from '../actions/AdvancedSearch/validateAdvancedSearchAction';

export const submitAdvancedSearchSequence = [
  validateAdvancedSearchAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      clearAlertsAction,
      setWaitingForResponseAction,
      submitAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
      unsetWaitingForResponseAction,
    ],
  },
];

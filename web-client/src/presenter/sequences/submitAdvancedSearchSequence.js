import { clearAlertsAction } from '../actions/clearAlertsAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { submitAdvancedSearchAction } from '../actions/AdvancedSearch/submitAdvancedSearchAction';
import { validateAdvancedSearchAction } from '../actions/AdvancedSearch/validateAdvancedSearchAction';

export const submitAdvancedSearchSequence = [
  validateAdvancedSearchAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      clearAlertsAction,
      set(state.submitting, true),
      submitAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
      set(state.submitting, false),
    ],
  },
];

import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../../actions/setWaitingForResponseAction';
import { submitPublicAdvancedSearchAction } from '../../actions/Public/submitPublicAdvancedSearchAction';
import { unsetWaitingForResponseAction } from '../../actions/unsetWaitingForResponseAction';
import { validateCaseAdvancedSearchAction } from '../../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitPublicAdvancedSearchSequence = [
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
      submitPublicAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
      unsetWaitingForResponseAction,
    ],
  },
];

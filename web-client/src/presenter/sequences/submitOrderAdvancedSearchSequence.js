import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { validateOrderAdvancedSearchAction } from '../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

export const submitOrderAdvancedSearchSequence = [
  clearSearchTermAction,
  validateOrderAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      unset(state.searchResults),
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      set(state.searchResults, props.searchResults),
    ]),
  },
];

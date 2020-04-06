import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearDocketNumberSearchFormAction } from '../actions/clearDocketNumberSearchFormAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitOrderAdvancedSearchAction } from '../actions/AdvancedSearch/submitOrderAdvancedSearchAction';
import { validateOrderAdvancedSearchAction } from '../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

export const submitOrderAdvancedSearchSequence = [
  clearSearchTermAction,
  clearDocketNumberSearchFormAction,
  validateOrderAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      unset(state.searchResults),
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitOrderAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
    ]),
  },
];

import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { submitPublicAdvancedSearchAction } from '../../actions/Public/submitPublicAdvancedSearchAction';
import { validateCaseAdvancedSearchAction } from '../../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitPublicAdvancedSearchSequence = [
  clearSearchTermAction,
  validateCaseAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      unset(state.searchResults),
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitPublicAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
    ]),
  },
];

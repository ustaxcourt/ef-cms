import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { submitPublicCaseAdvancedSearchAction } from '../../actions/Public/submitPublicCaseAdvancedSearchAction';
import { validateCaseAdvancedSearchAction } from '../../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitPublicCaseAdvancedSearchSequence = [
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
      submitPublicCaseAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
    ]),
  },
];

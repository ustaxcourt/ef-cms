import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { submitPublicOrderAdvancedSearchAction } from '../../actions/Public/submitPublicOrderAdvancedSearchAction';
import { validateOrderAdvancedSearchAction } from '../../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

export const submitPublicOrderAdvancedSearchSequence = [
  clearSearchTermAction,
  validateOrderAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
      startShowValidationAction,
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitPublicOrderAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
    ]),
  },
];

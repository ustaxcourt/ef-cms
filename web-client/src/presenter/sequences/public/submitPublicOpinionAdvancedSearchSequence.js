import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { submitPublicOpinionAdvancedSearchAction } from '../../actions/Public/submitPublicOpinionAdvancedSearchAction';
import { validateOpinionAdvancedSearchAction } from '../../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

export const submitPublicOpinionAdvancedSearchSequence = [
  clearSearchTermAction,
  validateOpinionAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
      startShowValidationAction,
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitPublicOpinionAdvancedSearchAction,
      set(state.searchResults, props.searchResults),
    ]),
  },
];

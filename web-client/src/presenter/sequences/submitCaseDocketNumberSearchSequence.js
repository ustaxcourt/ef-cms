import { caseExistsAction } from '../actions/caseExistsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setDocketNumberFromAdvancedSearchAction } from '../actions/AdvancedSearch/setDocketNumberFromAdvancedSearchAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';
import { validateCaseDocketNumberSearchAction } from '../actions/AdvancedSearch/validateCaseDocketNumberSearchAction';

export const submitCaseDocketNumberSearchSequence = [
  clearSearchTermAction,
  validateCaseDocketNumberSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      setDocketNumberFromAdvancedSearchAction,
      caseExistsAction,
      {
        error: [set(state.searchResults, [])],
        success: [navigateToCaseDetailAction],
      },
    ]),
  },
];

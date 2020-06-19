import { caseExistsAndIsNotSealedAction } from '../../actions/caseExistsAndIsNotSealedAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { navigateToCaseDetailAction } from '../../actions/navigateToCaseDetailAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setDocketNumberFromAdvancedSearchAction } from '../../actions/AdvancedSearch/setDocketNumberFromAdvancedSearchAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateCaseDocketNumberSearchAction } from '../../actions/AdvancedSearch/validateCaseDocketNumberSearchAction';

export const submitPublicCaseDocketNumberSearchSequence = [
  clearSearchTermAction,
  startShowValidationAction,
  validateCaseDocketNumberSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      setDocketNumberFromAdvancedSearchAction,
      caseExistsAndIsNotSealedAction,
      {
        error: [set(state.searchResults, [])],
        success: [navigateToCaseDetailAction],
      },
    ]),
  },
];

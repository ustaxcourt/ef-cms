import { caseExistsAction } from '../../actions/caseExistsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { navigateToCaseDetailAction } from '../../actions/navigateToCaseDetailAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setDocketNumberFromAdvancedSearchAction } from '../../actions/AdvancedSearch/setDocketNumberFromAdvancedSearchAction';
import { setNoMatchesCaseSearchAction } from '../../actions/AdvancedSearch/setNoMatchesCaseSearchAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
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
      caseExistsAction,
      {
        error: [setNoMatchesCaseSearchAction],
        success: [navigateToCaseDetailAction],
      },
    ]),
  },
];

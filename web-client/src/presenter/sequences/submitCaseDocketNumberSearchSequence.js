import { caseExistsAction } from '../actions/caseExistsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketNumberFromAdvancedSearchAction } from '../actions/AdvancedSearch/setDocketNumberFromAdvancedSearchAction';
import { setNoMatchesCaseSearchAction } from '../actions/AdvancedSearch/setNoMatchesCaseSearchAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { showSealedToPublicCaseAction } from '../actions/showSealedToPublicCaseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseDocketNumberSearchAction } from '../actions/AdvancedSearch/validateCaseDocketNumberSearchAction';

export const submitCaseDocketNumberSearchSequence = [
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
        success: [
          getCaseAction,
          setCaseAction,
          getCaseAssociationAction,
          showSealedToPublicCaseAction,
          {
            no: [navigateToCaseDetailAction],
            yes: [
              setCurrentPageAction('SealedCaseDetail'),
              clearSearchTermAction,
            ],
          },
        ],
      },
    ]),
  },
];

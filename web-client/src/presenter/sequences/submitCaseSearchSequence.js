import { caseExistsAction } from '../actions/caseExistsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getPublicCaseAction } from '../actions/Public/getPublicCaseAction';
import { navigateToCaseDetailWithDocketNumberAction } from '../actions/navigateToCaseDetailWithDocketNumberAction';
import { navigateToCaseSearchNoMatchesAction } from '../actions/navigateToCaseSearchNoMatchesAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketNumberFromSearchAction } from '../actions/setDocketNumberFromSearchAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { showSealedToPublicCaseAction } from '../actions/showSealedToPublicCaseAction';

export const submitCaseSearchSequence = showProgressSequenceDecorator([
  setDocketNumberFromSearchAction,
  caseExistsAction,
  {
    error: [navigateToCaseSearchNoMatchesAction],
    success: [
      getCaseAction,
      setCaseAction,
      getCaseAssociationAction,
      showSealedToPublicCaseAction,
      {
        no: [navigateToCaseDetailWithDocketNumberAction, clearSearchTermAction],
        yes: [
          getPublicCaseAction,
          setCurrentPageAction('SealedCaseDetail'),
          clearSearchTermAction,
        ],
      },
    ],
  },
]);

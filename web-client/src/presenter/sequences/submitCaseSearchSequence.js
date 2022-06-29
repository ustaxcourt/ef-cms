import { caseExistsAction } from '../actions/caseExistsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToCaseSearchNoMatchesAction } from '../actions/navigateToCaseSearchNoMatchesAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketNumberFromSearchAction } from '../actions/setDocketNumberFromSearchAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitCaseSearchSequence = showProgressSequenceDecorator([
  setDocketNumberFromSearchAction,
  caseExistsAction,
  {
    error: [navigateToCaseSearchNoMatchesAction],
    success: [
      getCaseAction,
      setCaseAction,
      getCaseAssociationAction,
      navigateToCaseDetailAction,
      clearSearchTermAction,
    ],
  },
]);

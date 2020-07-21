import { caseExistsAction } from '../actions/caseExistsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { navigateToCaseDetailWithDocketNumberAction } from '../actions/navigateToCaseDetailWithDocketNumberAction';
import { navigateToCaseSearchNoMatchesAction } from '../actions/navigateToCaseSearchNoMatchesAction';
import { setDocketNumberFromSearchAction } from '../actions/setDocketNumberFromSearchAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitCaseSearchSequence = showProgressSequenceDecorator([
  setDocketNumberFromSearchAction,
  caseExistsAction,
  {
    error: [navigateToCaseSearchNoMatchesAction],
    success: [
      navigateToCaseDetailWithDocketNumberAction,
      clearSearchTermAction,
    ],
  },
]);

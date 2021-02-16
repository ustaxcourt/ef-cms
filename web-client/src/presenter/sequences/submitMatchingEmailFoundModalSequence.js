import { addExistingUserToCaseAction } from '../actions/CaseDetail/addExistingUserToCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitMatchingEmailFoundModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    addExistingUserToCaseAction,
    navigateBackAction,
  ]),
];

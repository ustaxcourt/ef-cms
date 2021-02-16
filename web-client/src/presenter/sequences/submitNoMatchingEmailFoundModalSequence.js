import { addNewUserToCaseAction } from '../actions/CaseDetail/addNewUserToCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitNoMatchingEmailFoundModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    addNewUserToCaseAction,
    navigateBackAction,
  ]),
];

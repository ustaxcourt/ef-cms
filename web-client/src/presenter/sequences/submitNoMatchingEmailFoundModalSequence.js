import { clearModalAction } from '../actions/clearModalAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitNoMatchingEmailFoundModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    // TODO: submit the request to the backend
    navigateBackAction,
  ]),
];

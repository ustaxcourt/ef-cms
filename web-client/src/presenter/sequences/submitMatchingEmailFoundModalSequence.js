import { clearModalAction } from '../actions/clearModalAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitMatchingEmailFoundModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    // TODO: submit the request to the backend
    navigateBackAction,
  ]),
];

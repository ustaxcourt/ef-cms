import { clearModalAction } from '../actions/clearModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitUnsealDocketEntryAction } from '../actions/DocketEntry/submitUnsealDocketEntryAction';

export const unsealDocketEntrySequence = showProgressSequenceDecorator([
  clearModalAction,
  submitUnsealDocketEntryAction,
]);

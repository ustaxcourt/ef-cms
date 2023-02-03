import { clearModalAction } from '../actions/clearModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitSealDocketEntryAction } from '../actions/DocketEntry/submitSealDocketEntryAction';

export const sealDocketEntrySequence = showProgressSequenceDecorator([
  clearModalAction,
  submitSealDocketEntryAction,
]);

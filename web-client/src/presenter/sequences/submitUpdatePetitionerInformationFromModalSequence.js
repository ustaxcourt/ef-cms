import { clearModalAction } from '../actions/clearModalAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';

export const submitUpdatePetitionerInformationFromModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    submitUpdatePetitionerInformationSequence,
  ]),
];

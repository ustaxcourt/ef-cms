import { clearModalAction } from '../actions/clearModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';

export const submitUpdatePetitionerInformationFromModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    submitUpdatePetitionerInformationSequence,
  ]),
];

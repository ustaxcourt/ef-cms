import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';

export const submitUpdatePetitionerInformationFromModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    submitUpdatePetitionerInformationSequence,
    navigateToCaseDetailCaseInformationActionFactory('petitioner'),
  ]),
];

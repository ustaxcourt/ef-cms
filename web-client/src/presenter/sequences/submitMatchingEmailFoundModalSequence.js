import { addExistingUserToCaseAction } from '../actions/CaseDetail/addExistingUserToCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';

export const submitMatchingEmailFoundModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    submitUpdatePetitionerInformationSequence,
    addExistingUserToCaseAction,
    navigateToCaseDetailCaseInformationActionFactory('petitioner'),
  ]),
];

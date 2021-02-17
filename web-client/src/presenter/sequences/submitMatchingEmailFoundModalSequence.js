import { addExistingUserToCaseAction } from '../actions/CaseDetail/addExistingUserToCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';

export const submitMatchingEmailFoundModalSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    addExistingUserToCaseAction,
    submitUpdatePetitionerInformationSequence,
    navigateBackAction,
  ]),
];

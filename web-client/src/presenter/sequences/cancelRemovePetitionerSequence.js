import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setPartyViewTabAfterUpdatingPetitionersAction } from '../actions/setPartyViewTabAfterUpdatingPetitionersAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const cancelRemovePetitionerSequence = showProgressSequenceDecorator([
  clearModalAction,
  clearModalStateAction,
  setPartyViewTabAfterUpdatingPetitionersAction,
  navigateToCaseDetailCaseInformationActionFactory('parties'),
]);

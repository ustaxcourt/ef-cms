import { navigateToEditSavedPetitionAction } from '../actions/caseDetailEdit/navigateToEditSavedPetitionAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';

export const navigateToEditSavedPetitionSequence = [
  navigateToEditSavedPetitionAction,
  setDocumentDetailTabAction,
];

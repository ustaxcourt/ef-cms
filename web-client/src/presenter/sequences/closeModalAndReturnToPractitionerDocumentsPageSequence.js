import { clearModalAction } from '../actions/clearModalAction';
import { navigateToPractitionerDocumentsPageAction } from '../actions/navigateToPractitionerDocumentsPageAction';

export const closeModalAndReturnToPractitionerDocumentsPageSequence = [
  clearModalAction,
  navigateToPractitionerDocumentsPageAction,
];

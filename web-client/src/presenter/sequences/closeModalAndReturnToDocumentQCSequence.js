import { clearModalAction } from '../actions/clearModalAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';

export const closeModalAndReturnToDocumentQCSequence = [
  clearModalAction,
  navigateToDocumentQCAction,
];

import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';

export const closeModalAndNavigateSequence = [
  clearModalAction,
  followRedirectAction,
  {
    default: [navigateToDocumentQCAction],
    success: [],
  },
];

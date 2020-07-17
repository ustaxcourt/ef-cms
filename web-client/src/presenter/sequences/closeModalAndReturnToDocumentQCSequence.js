import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';

// TODO: Maybe rename this since it's not _always_ returning to DocumentQC if redirect is set
export const closeModalAndReturnToDocumentQCSequence = [
  clearModalAction,
  followRedirectAction,
  {
    default: [navigateToDocumentQCAction],
    success: [],
  },
];

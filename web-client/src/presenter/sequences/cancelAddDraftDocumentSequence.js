import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailSequence } from './navigateToCaseDetailSequence';

export const cancelAddDraftDocumentSequence = [
  getCaseAction,
  clearModalAction,
  followRedirectAction,
  {
    default: [...navigateToCaseDetailSequence],
    success: [],
  },
];

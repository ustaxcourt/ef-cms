import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailSequence } from './navigateToCaseDetailSequence';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const cancelAddDraftDocumentSequence = [
  getCaseAction,
  clearModalAction,
  followRedirectAction,
  {
    default: [setCaseDetailPageTabFrozenAction, navigateToCaseDetailSequence],
    success: [],
  },
];

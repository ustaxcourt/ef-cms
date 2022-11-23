import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveDocumentErrorSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  setShowModalFactoryAction('WorkItemAlreadyCompletedModal'),
];

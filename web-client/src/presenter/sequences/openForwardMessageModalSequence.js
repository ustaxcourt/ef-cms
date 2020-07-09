import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setForwardMessageModalDialogModalStateAction } from '../actions/WorkItem/setForwardMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openForwardMessageModalSequence = [
  clearModalStateAction,
  getMostRecentMessageInThreadAction,
  setForwardMessageModalDialogModalStateAction,
  setShowModalFactoryAction('ForwardMessageModal'),
];

import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setReplyToMessageModalDialogModalStateAction } from '../actions/WorkItem/setReplyToMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openReplyToMessageModalSequence = [
  clearModalStateAction,
  getMostRecentMessageInThreadAction,
  setReplyToMessageModalDialogModalStateAction,
  setShowModalFactoryAction('ReplyToMessageModal'),
];

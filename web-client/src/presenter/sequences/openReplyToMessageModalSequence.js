import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setReplyToMessageModalDialogModalStateAction } from '../actions/WorkItem/setReplyToMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openReplyToMessageModalSequence = [
  clearModalStateAction,
  setReplyToMessageModalDialogModalStateAction,
  setShowModalFactoryAction('ReplyToMessageModal'),
];

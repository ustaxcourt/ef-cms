import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setForwardMessageModalDialogModalStateAction } from '../actions/WorkItem/setForwardMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openForwardMessageModalSequence = [
  clearModalStateAction,
  setForwardMessageModalDialogModalStateAction,
  setShowModalFactoryAction('ForwardMessageModal'),
];

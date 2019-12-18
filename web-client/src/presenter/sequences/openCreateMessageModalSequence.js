import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCreateMessageModalSequence = [
  clearModalStateAction,
  setCreateMessageModalDialogModalStateAction,
  setShowModalFactoryAction('CreateMessageModalDialog'),
];

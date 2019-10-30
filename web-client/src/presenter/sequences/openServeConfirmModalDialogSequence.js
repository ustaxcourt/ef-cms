import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openServeConfirmModalDialogSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ServeConfirmModalDialog'),
];

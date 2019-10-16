import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { state } from 'cerebral';

export const openCreateMessageAlongsideDocketRecordQCModalSequence = [
  clearModalStateAction,
  setCreateMessageModalDialogModalStateAction,
  set(state.showModal, 'CreateMessageAlongsideDocketRecordQCModal'),
];

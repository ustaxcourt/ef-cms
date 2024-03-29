import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDownloadDocketEntriesModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('DownloadDocketEntriesModal'),
];

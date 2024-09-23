import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getJudgesChambersSequence } from '@web-client/presenter/sequences/getJudgesChambersSequence';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setForwardMessageModalDialogModalStateAction } from '../actions/WorkItem/setForwardMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openForwardMessageModalSequence = [
  clearModalStateAction,
  getMostRecentMessageInThreadAction,
  getJudgesChambersSequence,
  setForwardMessageModalDialogModalStateAction,
  setShowModalFactoryAction('ForwardMessageModal'),
];

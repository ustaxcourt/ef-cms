import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getJudgesChambersSequence } from '@web-client/presenter/sequences/getJudgesChambersSequence';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const openCreateMessageModalSequence = showProgressSequenceDecorator([
  clearModalStateAction,
  getJudgesChambersSequence,
  setCreateMessageModalDialogModalStateAction,
  setShowModalFactoryAction('CreateMessageModal'),
]);

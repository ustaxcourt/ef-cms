import { clearModalStateAction } from '../actions/clearModalStateAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPrintPaperTrialNoticesAction } from '@web-client/presenter/actions/TrialSession/navigateToPrintPaperTrialNoticesAction';
import { setNottServiceCompleteAction } from '../actions/TrialSession/setNottServiceCompleteAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const thirtyDayNoticePaperServiceCompleteSequence = [
  unsetWaitingForResponseAction,
  setNottServiceCompleteAction,
  clearModalStateAction,
  hasPaperAction,
  {
    electronic: [],
    paper: [navigateToPrintPaperTrialNoticesAction],
  },
] as unknown as ({
  fileId,
  hasPaper,
}: {
  fileId: string;
  hasPaper?: boolean;
}) => void;

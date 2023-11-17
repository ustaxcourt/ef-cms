import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { getNoticeGenerationSuccessMessageAction } from '@web-client/presenter/actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const noticeGenerationCompleteSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  getNoticeGenerationSuccessMessageAction,
  setAlertSuccessAction,
];

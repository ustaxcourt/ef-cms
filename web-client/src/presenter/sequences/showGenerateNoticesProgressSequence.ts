// import { startRefreshIntervalAction } from '../actions/startRefreshIntervalAction';

import { resetNoticeStatusAction } from '../actions/resetNoticeStatusAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const showGenerateNoticesProgressSequence = [
  unsetWaitingForResponseAction,
  setShowModalFactoryAction('NoticeStatusModal'),
  resetNoticeStatusAction,
];

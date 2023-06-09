// import { startRefreshIntervalAction } from '../actions/startRefreshIntervalAction';

import { resetPaperServiceStatusAction } from '../actions/resetPaperServiceStatusAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const showPaperServiceProgressSequence = [
  unsetWaitingForResponseAction,
  setShowModalFactoryAction('PaperServiceStatusModal'),
  resetPaperServiceStatusAction,
];

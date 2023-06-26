import { haveNOTTsBeenServedAction } from '../actions/TrialSession/haveNOTTsBeenServedAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const showThirtyDayNoticeModalSequence = [
  haveNOTTsBeenServedAction,
  {
    no: [setShowModalFactoryAction('ServeThirtyDayNoticeModal')],
    yes: [setShowModalFactoryAction('DismissThirtyDayNoticeModal')],
  },
];

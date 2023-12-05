import { clearModalAction } from '../actions/clearModalAction';
import { serveThirtyDayNoticeOfTrialAction } from '../actions/TrialSession/serveThirtyDayNoticeOfTrialAction';

export const serveThirtyDayNoticeOfTrialSequence = [
  clearModalAction,
  serveThirtyDayNoticeOfTrialAction,
];

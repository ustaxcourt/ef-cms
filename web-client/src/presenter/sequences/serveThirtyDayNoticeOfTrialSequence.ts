import { clearModalAction } from '../actions/clearModalAction';
import { sequence } from 'cerebral';
import { serveThirtyDayNoticeOfTrialAction } from '../actions/TrialSession/serveThirtyDayNoticeOfTrialAction';

export const serveThirtyDayNoticeOfTrialSequence = sequence([
  clearModalAction,
  serveThirtyDayNoticeOfTrialAction,
]);

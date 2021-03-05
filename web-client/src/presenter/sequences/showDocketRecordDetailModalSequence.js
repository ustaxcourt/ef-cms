import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setDocketRecordIndexAction } from '../actions/setDocketRecordIndexAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const showDocketRecordDetailModalSequence = [
  clearAlertsAction,
  setDocketRecordIndexAction,
  setShowModalAction,
];

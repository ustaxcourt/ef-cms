import { clearAlertsAction } from '../actions/clearAlertsAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setShowModalAction } from '../actions/setShowModalAction';

export const showDocketRecordDetailModalSequence = [
  clearAlertsAction,
  set(state.docketRecordIndex, props.docketRecordIndex),
  setShowModalAction,
];

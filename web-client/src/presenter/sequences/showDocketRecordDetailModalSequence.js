import { props, state } from 'cerebral';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { set } from 'cerebral/factories';

export const showDocketRecordDetailModalSequence = [
  clearAlertsAction,
  set(state.docketRecordIndex, props.docketRecordIndex),
  set(state.showModal, props.showModal),
];

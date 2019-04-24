import { props, state } from 'cerebral';

import { set } from 'cerebral/factories';

export const showDocketRecordDetailModalSequence = [
  set(state.docketRecordIndex, props.docketRecordIndex),
  set(state.showModal, props.showModal),
];

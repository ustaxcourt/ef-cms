import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const gotoPrintableDocketRecordSequence = [
  set(state.currentPage, 'PrintableDocketRecord'),
];

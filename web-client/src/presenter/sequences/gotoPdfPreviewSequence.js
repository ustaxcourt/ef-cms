import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const gotoPdfPreviewSequence = [
  set(state.currentPage, 'SimplePdfPreviewPage'),
];

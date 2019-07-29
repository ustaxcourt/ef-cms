import { selectDocumentForScanAction } from '../actions/selectDocumentForScanAction';
import { state } from 'cerebral';
import { unset } from 'cerebral/factories';

export const selectDocumentForScanSequence = [
  unset(state.documentSelectedForPreview),
  selectDocumentForScanAction,
];

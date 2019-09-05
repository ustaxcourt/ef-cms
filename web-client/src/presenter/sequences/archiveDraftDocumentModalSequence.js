import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const archiveDraftDocumentModalSequence = [
  set(state.showModal, 'DeleteDraftDocumentModal'),
];

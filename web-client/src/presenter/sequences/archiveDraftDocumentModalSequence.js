import { set } from 'cerebral/factories';
import { setArchiveDraftDocumentAction } from '../actions/setArchiveDraftDocumentAction';
import { state } from 'cerebral';

export const archiveDraftDocumentModalSequence = [
  setArchiveDraftDocumentAction,
  set(state.showModal, 'ArchiveDraftDocumentModal'),
];

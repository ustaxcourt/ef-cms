import { setArchiveDraftDocumentAction } from '../actions/setArchiveDraftDocumentAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const archiveDraftDocumentModalSequence = [
  setArchiveDraftDocumentAction,
  setShowModalFactoryAction('ArchiveDraftDocumentModal'),
];

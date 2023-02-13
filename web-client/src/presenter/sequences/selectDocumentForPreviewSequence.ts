import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';

export const selectDocumentForPreviewSequence = [
  selectDocumentForPreviewAction,
  setPdfPreviewUrlSequence,
];

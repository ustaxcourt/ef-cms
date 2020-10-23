import { clearDraftDocumentViewerDocketEntryIdAction } from '../actions/clearDraftDocumentViewerDocketEntryIdAction';
import { unsetCorrespondenceDocumentViewerIdAction } from '../actions/CorrespondenceDocument/unsetCorrespondenceDocumentViewerIdAction';

export const clearDocumentViewerDataSequence = [
  clearDraftDocumentViewerDocketEntryIdAction,
  unsetCorrespondenceDocumentViewerIdAction,
];

import { loadPdfAction } from '../../actions/PDFPreviewModal/loadPdfAction';
import { setFormSubmittingAction } from '../../actions/setFormSubmittingAction';
import { setPageAction } from '../../actions/PDFPreviewModal/setPageAction';
import { unsetFormSubmittingAction } from '../../actions/unsetFormSubmittingAction';

export const loadPdfSequence = [
  setFormSubmittingAction,
  loadPdfAction,
  {
    error: [],
    success: [setPageAction],
  },
  unsetFormSubmittingAction,
];

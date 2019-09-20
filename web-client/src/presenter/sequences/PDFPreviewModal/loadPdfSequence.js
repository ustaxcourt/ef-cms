import { loadPdfAction } from '../../actions/PDFPreviewModal/loadPdfAction';
import { setPageAction } from '../../actions/PDFPreviewModal/setPageAction';
import { setWaitingForResponseAction } from '../../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../../actions/unsetWaitingForResponseAction';

export const loadPdfSequence = [
  setWaitingForResponseAction,
  loadPdfAction,
  {
    error: [],
    success: [setPageAction],
  },
  unsetWaitingForResponseAction,
];

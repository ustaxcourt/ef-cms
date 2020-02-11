import { loadPdfAction } from '../../actions/PDFPreviewModal/loadPdfAction';
import { setPageAction } from '../../actions/PDFPreviewModal/setPageAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const loadPdfSequence = showProgressSequenceDecorator([
  loadPdfAction,
  {
    error: [],
    success: [setPageAction],
  },
]);

import { loadPdfAction } from '../../actions/PDFPreviewModal/loadPdfAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const loadPdfSequence = showProgressSequenceDecorator([loadPdfAction]);

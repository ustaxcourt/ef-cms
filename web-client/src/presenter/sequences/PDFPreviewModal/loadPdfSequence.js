import { loadPdfAction } from '../../actions/PDFPreviewModal/loadPdfAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const loadPdfSequence = showProgressSequenceDecorator([loadPdfAction]);

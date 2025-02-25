import { getPDFForPreviewTabAction } from '../../actions/getPDFForPreviewTabAction';
import { loadPdfForTabAction } from '../../actions/PDFPreviewTab/loadPdfForTabAction';

import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const loadPdfForTabSequence = showProgressSequenceDecorator([
  getPDFForPreviewTabAction,
  loadPdfForTabAction,
]);

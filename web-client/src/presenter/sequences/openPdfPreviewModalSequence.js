import { getPDFForPreviewAction } from '../actions/getPDFForPreviewAction';
import { openPdfPreviewModalAction } from '../actions/openPdfPreviewModalAction';

export const openPdfPreviewModalSequence = [
  getPDFForPreviewAction,
  openPdfPreviewModalAction,
];

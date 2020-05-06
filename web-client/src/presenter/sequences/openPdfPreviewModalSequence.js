import { getPDFForPreviewAction } from '../actions/getPDFForPreviewAction';
import { openPdfPreviewModalAction } from '../actions/openPdfPreviewModalAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const openPdfPreviewModalSequence = showProgressSequenceDecorator([
  getPDFForPreviewAction,
  openPdfPreviewModalAction,
]);

import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { sequence } from '../../utilities/cerebralWrapper';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';

export const setPdfPreviewUrlSequence = sequence([
  clearPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
]);

import { openPdfPreviewModalAction } from '../actions/openPdfPreviewModalAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const openPdfPreviewModalSequence = [
  setFormSubmittingAction,
  openPdfPreviewModalAction,
  unsetFormSubmittingAction,
];

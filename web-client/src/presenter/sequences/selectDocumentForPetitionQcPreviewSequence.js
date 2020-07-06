import { getFormDocumentUrlForPreviewAction } from '../actions/getFormDocumentUrlForPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';

export const selectDocumentForPetitionQcPreviewSequence = [
  getFormDocumentUrlForPreviewAction,
  setPdfPreviewUrlSequence,
];

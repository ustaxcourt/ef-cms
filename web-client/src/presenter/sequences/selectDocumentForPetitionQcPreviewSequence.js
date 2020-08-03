import { getFormDocumentUrlForPreviewAction } from '../actions/getFormDocumentUrlForPreviewAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';

export const selectDocumentForPetitionQcPreviewSequence = [
  getFormDocumentUrlForPreviewAction,
  setPdfPreviewUrlSequence,
  setDocumentIdAction,
];

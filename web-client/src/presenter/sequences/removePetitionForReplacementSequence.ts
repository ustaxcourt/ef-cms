import { clearModalSequence } from './clearModalSequence';
import { removePetitionFromFormDocumentsAction } from '../actions/removePetitionFromFormDocumentsAction';
import { setDocumentForPreviewSequence } from './setDocumentForPreviewSequence';

export const removePetitionForReplacementSequence = [
  removePetitionFromFormDocumentsAction,
  setDocumentForPreviewSequence,
  clearModalSequence,
];

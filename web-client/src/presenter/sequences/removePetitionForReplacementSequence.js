import { clearModalSequence } from './clearModalSequence';
import { removePetitionFromFormDocumentsAction } from '../actions/removePetitionFromFormDocumentsAction';
import { selectDocumentForPetitionQcPreviewSequence } from './selectDocumentForPetitionQcPreviewSequence';

export const removePetitionForReplacementSequence = [
  removePetitionFromFormDocumentsAction,
  ...selectDocumentForPetitionQcPreviewSequence,
  clearModalSequence,
];

import { clearModalSequence } from './clearModalSequence';
import { removePetitionFromFormDocumentsAction } from '../actions/removePetitionFromFormDocumentsAction';
import { selectDocumentForPetitionQcPreviewSequence } from './selectDocumentForPetitionQcPreviewSequence';
import { setFormValueAction } from '../actions/setFormValueAction';

export const removePetitionForReplacementSequence = [
  removePetitionFromFormDocumentsAction,
  setFormValueAction,
  ...selectDocumentForPetitionQcPreviewSequence,
  clearModalSequence,
];

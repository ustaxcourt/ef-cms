import { generateCaseCaptionForSavedPetitionSequence } from './generateCaseCaptionForSavedPetitionSequence';
import { updateCaseValueSequence } from './updateCaseValueSequence';

export const updateCaseValueAndInternalCaseCaptionSequence = [
  updateCaseValueSequence,
  generateCaseCaptionForSavedPetitionSequence,
];

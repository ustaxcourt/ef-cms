import { generateCaseCaptionForSavedPetitionSequence } from './generateCaseCaptionForSavedPetitionSequence';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateCaseValueAndInternalCaseCaptionSequence = [
  setFormValueAction,
  generateCaseCaptionForSavedPetitionSequence,
];

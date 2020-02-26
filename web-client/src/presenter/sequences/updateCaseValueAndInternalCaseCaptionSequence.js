import { generateInternalCaseCaptionSequence } from './generateInternalCaseCaptionSequence';
import { updateCaseValueSequence } from './updateCaseValueSequence';

export const updateCaseValueAndInternalCaseCaptionSequence = [
  updateCaseValueSequence,
  generateInternalCaseCaptionSequence,
];

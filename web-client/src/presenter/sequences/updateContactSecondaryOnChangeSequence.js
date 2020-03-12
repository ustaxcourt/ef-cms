import { copyPrimaryContactSequence } from './copyPrimaryContactSequence';
import { updateFormValueSequence } from './updateFormValueSequence';

export const updateContactSecondaryOnChangeSequence = [
  updateFormValueSequence,
  copyPrimaryContactSequence,
];

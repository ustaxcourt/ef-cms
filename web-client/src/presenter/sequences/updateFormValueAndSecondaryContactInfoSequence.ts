import { copyPrimaryContactSequence } from './copyPrimaryContactSequence';
import { updateFormValueSequence } from './updateFormValueSequence';

export const updateFormValueAndSecondaryContactInfoSequence = [
  updateFormValueSequence,
  copyPrimaryContactSequence,
];

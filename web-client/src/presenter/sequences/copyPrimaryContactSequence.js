import { getFormContactPrimaryAction } from '../actions/StartCaseInternal/getFormContactPrimaryAction';
import { setFormContactSecondaryAction } from '../actions/StartCaseInternal/setFormContactSecondaryAction';

export const copyPrimaryContactSequence = [
  getFormContactPrimaryAction,
  setFormContactSecondaryAction,
];

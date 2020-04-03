import { getFormContactPrimaryAction } from '../actions/StartCaseInternal/getFormContactPrimaryAction';
import { setFormContactSecondaryAddressAction } from '../actions/StartCaseInternal/setFormContactSecondaryAddressAction';

export const copyPrimaryContactSequence = [
  getFormContactPrimaryAction,
  setFormContactSecondaryAddressAction,
];

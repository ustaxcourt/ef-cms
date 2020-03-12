import { getFormContactPrimaryAction } from '../actions/StartCaseInternal/getFormContactPrimaryAction';
import { getShouldCopyPrimaryToSecondaryAddressAction } from '../actions/ForwardForm/getShouldCopyPrimaryToSecondaryAddressAction';
import { setFormContactSecondaryAddressAction } from '../actions/StartCaseInternal/setFormContactSecondaryAddressAction';

export const copyPrimaryContactSequence = [
  getShouldCopyPrimaryToSecondaryAddressAction,
  {
    no: [],
    yes: [getFormContactPrimaryAction, setFormContactSecondaryAddressAction],
  },
];

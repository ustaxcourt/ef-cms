import { getFormContactPrimaryAction } from '../actions/StartCaseInternal/getFormContactPrimaryAction';
import { getShouldCopyPrimaryToSecondaryAddressAction } from '../actions/StartCaseInternal/getShouldCopyPrimaryToSecondaryAddressAction';
import { resetContactSecondaryAddressAction } from '@web-client/presenter/actions/StartCaseInternal/resetContactSecondaryAddressAction';
import { setFormContactSecondaryAddressAction } from '../actions/StartCaseInternal/setFormContactSecondaryAddressAction';

export const copyPrimaryContactSequence = [
  getShouldCopyPrimaryToSecondaryAddressAction,
  {
    no: [resetContactSecondaryAddressAction],
    yes: [getFormContactPrimaryAction, setFormContactSecondaryAddressAction],
  },
];

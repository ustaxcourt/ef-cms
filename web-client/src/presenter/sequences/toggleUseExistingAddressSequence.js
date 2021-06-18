import { getAndSetPetitionersAddressAction } from '../actions/CaseDetail/getAndSetPetitionersAddressAction';
import { shouldUseExistingAddressAction } from '../actions/CaseDetail/shouldUseExistingAddressAction';
import { unsetAddressOnFormAction } from '../actions/CaseDetail/unsetAddressOnFormAction';

export const toggleUseExistingAddressSequence = [
  shouldUseExistingAddressAction,
  {
    no: [unsetAddressOnFormAction],
    yes: [getAndSetPetitionersAddressAction],
  },
];

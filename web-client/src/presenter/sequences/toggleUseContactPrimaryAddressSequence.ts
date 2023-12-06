import { getAndSetPetitionersAddressAction } from '../actions/CaseDetail/getAndSetPetitionersAddressAction';
import { shouldUseContactPrimaryAddressAction } from '../actions/CaseDetail/shouldUseContactPrimaryAddressAction';
import { unsetContactSecondaryAddressOnFormAction } from '../actions/CaseDetail/unsetContactSecondaryAddressOnFormAction';

export const toggleUseContactPrimaryAddressSequence = [
  shouldUseContactPrimaryAddressAction,
  {
    no: [unsetContactSecondaryAddressOnFormAction],
    yes: [getAndSetPetitionersAddressAction],
  },
];

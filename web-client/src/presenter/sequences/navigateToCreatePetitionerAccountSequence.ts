import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { navigateToCreatePetitionerAccountAction } from '@web-client/presenter/actions/navigateToCreatePetitionerAccountAction';

export const navigateToCreatePetitionerAccountSequence = [
  clearFormAction,
  navigateToCreatePetitionerAccountAction,
];

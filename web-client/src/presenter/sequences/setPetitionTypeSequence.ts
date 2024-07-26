import { clearPetitionFormAction } from '@web-client/presenter/actions/clearPetitionFormAction';
import { setFormValueAction } from '@web-client/presenter/actions/setFormValueAction';

export const setPetitionTypeSequence = [
  clearPetitionFormAction,
  setFormValueAction,
];

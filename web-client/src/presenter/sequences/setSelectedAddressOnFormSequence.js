import { setSelectedPetitionerAddressAction } from '../actions/setSelectedPetitionerAddressAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const setSelectedAddressOnFormSequence = [
  setSelectedPetitionerAddressAction,
  setShowModalFactoryAction('FormCancelModalDialog'),
];

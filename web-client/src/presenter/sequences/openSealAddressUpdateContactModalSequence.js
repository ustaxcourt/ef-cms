import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setContactInformationForModalAction } from '../actions/CaseDetail/setContactInformationForModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openSealAddressUpdateContactModalSequence = [
  clearModalStateAction,
  setContactInformationForModalAction,
  setShowModalFactoryAction('SealAddressUpdateContactModal'),
];

import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setContactInformationForModalAction } from '../actions/CaseDetail/setContactInformationForModalAction';
// import { setReplyToMessageModalDialogModalStateAction } from '../actions/WorkItem/setReplyToMessageModalDialogModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openSealAddressModalSequence = [
  clearModalStateAction,
  setContactInformationForModalAction,
  setShowModalFactoryAction('SealAddressModal'),
];

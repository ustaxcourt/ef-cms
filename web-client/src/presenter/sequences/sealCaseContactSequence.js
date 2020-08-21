import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { sealAddressAction } from '../actions/sealAddressAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const sealCaseContactSequence = [
  showProgressSequenceDecorator([
    sealAddressAction,
    clearModalAction,
    clearModalStateAction,
    setAlertSuccessAction,
    getCaseAction,
    setCaseAction,
  ]),
];

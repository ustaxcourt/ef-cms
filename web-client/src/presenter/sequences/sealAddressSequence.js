import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { sealAddressAction } from '../actions/sealAddressAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const sealAddressSequence = showProgressSequenceDecorator([
  sealAddressAction,
  clearModalAction,
  clearModalStateAction,
  setAlertSuccessAction,
  setCaseAction,
]);

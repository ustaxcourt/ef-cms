import { setFormValueAction } from '../actions/setFormValueAction';
import { unsetDeniedOptionsOnStampFormAction } from '../actions/StampMotion/unsetDeniedOptionsOnStampFormAction';

export const applyStampFormChangeSequence = [
  setFormValueAction,
  unsetDeniedOptionsOnStampFormAction,
];

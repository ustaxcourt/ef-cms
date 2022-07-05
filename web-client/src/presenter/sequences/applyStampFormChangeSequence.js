import { setFormValueAction } from '../actions/setFormValueAction';
import { unsetDeniedOptionsOnStampFormAction } from '../actions/ApplyStamp/unsetDeniedOptionsOnStampFormAction';

export const applyStampFormChangeSequence = [
  setFormValueAction,
  unsetDeniedOptionsOnStampFormAction,
];

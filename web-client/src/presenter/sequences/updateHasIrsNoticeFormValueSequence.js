import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { updateHasIrsNoticeAction } from '../actions/updateHasIrsNoticeAction';

export const updateHasIrsNoticeFormValueSequence = [
  set(state.form[props.key], props.value),
  updateHasIrsNoticeAction,
];

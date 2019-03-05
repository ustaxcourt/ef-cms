import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';
import { updateHasIrsNoticeAction } from '../actions/updateHasIrsNoticeAction';

export const updateHasIrsNoticeFormValueSequence = [
  set(state.form[props.key], props.value),
  updateHasIrsNoticeAction,
];

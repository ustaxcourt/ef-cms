import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import { updateHasIrsNoticeAction } from '../actions/updateHasIrsNoticeAction';

export default [
  set(state.form[props.key], props.value),
  updateHasIrsNoticeAction,
];

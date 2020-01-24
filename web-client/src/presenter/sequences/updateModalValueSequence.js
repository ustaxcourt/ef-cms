import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateModalValueSequence = [
  props => {
    console.log(props);
  },
  set(state.modal[props.key], props.value),
];

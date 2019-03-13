import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updatePetitionValueSequence = [
  set(state.petition[props.key], props.value),
];

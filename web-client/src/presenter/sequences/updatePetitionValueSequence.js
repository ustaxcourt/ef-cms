import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updatePetitionValueSequence = [
  set(state.petition[props.key], props.value),
];

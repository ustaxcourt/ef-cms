import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updatePetitionValueSequence = [
  set(state.petition[props.key], props.value),
];

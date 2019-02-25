import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const toggleCaseDifferenceSequence = [
  toggle(state.form.showCaseDifference),
];

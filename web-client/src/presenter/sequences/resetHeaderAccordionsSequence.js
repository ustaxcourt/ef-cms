import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const resetHeaderAccordionsSequence = [
  set(state.isAccountMenuOpen, false),
  set(state.isReportsMenuOpen, false),
];

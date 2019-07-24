import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleAccountMenuSequence = [toggle(state.isAccountMenuOpen)];

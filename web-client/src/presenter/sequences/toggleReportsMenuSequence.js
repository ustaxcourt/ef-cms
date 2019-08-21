import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleReportsMenuSequence = [toggle(state.isReportsMenuOpen)];

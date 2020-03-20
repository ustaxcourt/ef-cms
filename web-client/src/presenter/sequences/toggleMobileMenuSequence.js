import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleMobileMenuSequence = [toggle(state.header.showMobileMenu)];

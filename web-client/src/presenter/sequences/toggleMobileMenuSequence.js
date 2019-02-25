import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const toggleMobileMenuSequence = [toggle(state.mobileMenu.isVisible)];

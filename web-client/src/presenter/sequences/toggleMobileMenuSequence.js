import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export default [toggle(state.mobileMenu.isVisible)];

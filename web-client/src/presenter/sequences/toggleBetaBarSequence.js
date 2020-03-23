import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleBetaBarSequence = [toggle(state.header.showBetaBar)];

import { state } from '@web-client/presenter/app.cerebral';
import { toggle } from 'cerebral/factories';

export const toggleBetaBarSequence = [toggle(state.header.showBetaBar)];

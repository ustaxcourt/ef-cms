import { state } from 'cerebral';
import { unset } from 'cerebral/factories';

export const resetHeaderAccordionsSequence = [unset(state.navigation.openMenu)];

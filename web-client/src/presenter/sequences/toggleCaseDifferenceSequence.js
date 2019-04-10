import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleCaseDifferenceSequence = [
  toggle(state.screenMetadata.showCaseDifference),
];

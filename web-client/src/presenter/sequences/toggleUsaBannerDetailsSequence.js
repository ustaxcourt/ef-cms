import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const toggleUsaBannerDetailsSequence = [
  toggle(state.usaBanner.showDetails),
];

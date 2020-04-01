import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleUsaBannerDetailsSequence = [
  toggle(state.header.showUsaBannerDetails),
];

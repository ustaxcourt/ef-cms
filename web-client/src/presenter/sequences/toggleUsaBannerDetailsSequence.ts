import { state } from '@web-client/presenter/app.cerebral';
import { toggle } from 'cerebral/factories';

export const toggleUsaBannerDetailsSequence = [
  toggle(state.header.showUsaBannerDetails),
];

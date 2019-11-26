import { state } from './state-public';

import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/navigateToPublicSiteSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';

export const presenter = {
  providers: {},
  sequences: {
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
  },
  state,
};

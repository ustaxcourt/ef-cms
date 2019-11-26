import { state } from './state-public';

import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/navigateToPublicSiteSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';

export const presenter = {
  providers: {},
  sequences: {
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
    updateAdvancedSearchFormValueSequence,
  },
  state,
};

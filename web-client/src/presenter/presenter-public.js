import { state } from './state-public';

import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { resetHeaderAccordionsSequence } from './sequences/resetHeaderAccordionsSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';

export const presenter = {
  providers: {},
  sequences: {
    navigateToCognitoSequence,
    resetHeaderAccordionsSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
  },
  state,
};

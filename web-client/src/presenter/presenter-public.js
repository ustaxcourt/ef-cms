import { state } from './state-public';

import { resetHeaderAccordionsSequence } from './sequences/resetHeaderAccordionsSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleMenuSequence } from './sequences/toggleMenuSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';

export const presenter = {
  providers: {},
  sequences: {
    resetHeaderAccordionsSequence,
    toggleUsaBannerDetailsSequence,
  },
  state,
  toggleBetaBarSequence,
  toggleMenuSequence,
};

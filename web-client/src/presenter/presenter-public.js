import { state } from './state-public';

import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearDocketNumberSearchFormSequence } from './sequences/clearDocketNumberSearchFormSequence';
import { gotoPublicCaseDetailSequence } from './sequences/gotoPublicCaseDetailSequence';
import { gotoPublicSearchSequence } from './sequences/gotoPublicSearchSequence';
import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/navigateToPublicSiteSequence';
import { submitCaseDocketNumberSearchSequence } from './sequences/submitCaseDocketNumberSearchSequence';
import { submitPublicAdvancedSearchSequence } from './sequences/submitPublicAdvancedSearchSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';

export const presenter = {
  providers: {},
  sequences: {
    cerebralBindSimpleSetStateSequence,
    clearAdvancedSearchFormSequence,
    clearDocketNumberSearchFormSequence,
    gotoPublicCaseDetailSequence,
    gotoPublicSearchSequence,
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    submitCaseDocketNumberSearchSequence,
    submitPublicAdvancedSearchSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
    updateAdvancedSearchFormValueSequence,
    updateDocketNumberSearchFormSequence,
  },
  state,
};

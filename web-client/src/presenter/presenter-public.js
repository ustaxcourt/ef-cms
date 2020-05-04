import { state } from './state-public';

import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { gotoPublicCaseDetailSequence } from './sequences/public/gotoPublicCaseDetailSequence';
import { gotoPublicPrintableDocketRecordSequence } from './sequences/public/gotoPublicPrintableDocketRecordSequence';
import { gotoPublicSearchSequence } from './sequences/public/gotoPublicSearchSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/public/navigateToPublicSiteSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { submitCaseDocketNumberSearchSequence } from './sequences/submitCaseDocketNumberSearchSequence';
import { submitPublicCaseAdvancedSearchSequence } from './sequences/public/submitPublicCaseAdvancedSearchSequence';
import { submitPublicOrderAdvancedSearchSequence } from './sequences/public/submitPublicOrderAdvancedSearchSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedOrderSearchFormValueSequence } from './sequences/updateAdvancedOrderSearchFormValueSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { validateCaseAdvancedSearchFormSequence } from './sequences/validateCaseAdvancedSearchFormSequence';
import { validateOrderSearchSequence } from './sequences/validateOrderSearchSequence';

export const presenter = {
  providers: {},
  sequences: {
    advancedSearchTabChangeSequence,
    cerebralBindSimpleSetStateSequence,
    clearAdvancedSearchFormSequence,
    clearPdfPreviewUrlSequence,
    gotoPublicCaseDetailSequence,
    gotoPublicPrintableDocketRecordSequence,
    gotoPublicSearchSequence,
    navigateBackSequence,
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    showMoreResultsSequence,
    submitCaseDocketNumberSearchSequence,
    submitPublicCaseAdvancedSearchSequence: submitPublicCaseAdvancedSearchSequence,
    submitPublicOrderAdvancedSearchSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
    updateAdvancedOrderSearchFormValueSequence,
    updateAdvancedSearchFormValueSequence,
    updateDocketNumberSearchFormSequence,
    validateCaseAdvancedSearchFormSequence,
    validateOrderSearchSequence,
  },
  state,
};

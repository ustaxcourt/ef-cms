import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { gotoPublicCaseDetailSequence } from './sequences/public/gotoPublicCaseDetailSequence';
import { gotoPublicPrintableDocketRecordSequence } from './sequences/public/gotoPublicPrintableDocketRecordSequence';
import { gotoPublicSearchSequence } from './sequences/public/gotoPublicSearchSequence';
import { gotoTodaysOpinionsSequence } from './sequences/public/gotoTodaysOpinionsSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/public/navigateToPublicSiteSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openCaseDocumentDownloadUrlSequence } from './sequences/openCaseDocumentDownloadUrlSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { state } from './state-public';
import { submitPublicCaseAdvancedSearchSequence } from './sequences/public/submitPublicCaseAdvancedSearchSequence';
import { submitPublicCaseDocketNumberSearchSequence } from './sequences/public/submitPublicCaseDocketNumberSearchSequence';
import { submitPublicOpinionAdvancedSearchSequence } from './sequences/public/submitPublicOpinionAdvancedSearchSequence';
import { submitPublicOrderAdvancedSearchSequence } from './sequences/public/submitPublicOrderAdvancedSearchSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedOpinionSearchFormValueSequence } from './sequences/updateAdvancedOpinionSearchFormValueSequence';
import { updateAdvancedOrderSearchFormValueSequence } from './sequences/updateAdvancedOrderSearchFormValueSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { validateCaseAdvancedSearchFormSequence } from './sequences/validateCaseAdvancedSearchFormSequence';
import { validateCaseDocketNumberSearchFormSequence } from './sequences/validateCaseDocketNumberSearchFormSequence';
import { validateOpinionSearchSequence } from './sequences/validateOpinionSearchSequence';
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
    gotoTodaysOpinionsSequence,
    navigateBackSequence,
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    notFoundErrorSequence,
    openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence,
    submitPublicCaseAdvancedSearchSequence: submitPublicCaseAdvancedSearchSequence,
    submitPublicCaseDocketNumberSearchSequence,
    submitPublicOpinionAdvancedSearchSequence,
    submitPublicOrderAdvancedSearchSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
    updateAdvancedOpinionSearchFormValueSequence,
    updateAdvancedOrderSearchFormValueSequence,
    updateAdvancedSearchFormValueSequence,
    updateDocketNumberSearchFormSequence,
    validateCaseAdvancedSearchFormSequence,
    validateCaseDocketNumberSearchFormSequence,
    validateOpinionSearchSequence,
    validateOrderSearchSequence,
  },
  state,
};

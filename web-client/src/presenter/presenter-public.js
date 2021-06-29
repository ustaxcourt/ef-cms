import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { gotoContactSequence } from './sequences/gotoContactSequence';
import { gotoHealthCheckSequence } from './sequences/gotoHealthCheckSequence';
import { gotoPrivacySequence } from './sequences/gotoPrivacySequence';
import { gotoPublicCaseDetailSequence } from './sequences/public/gotoPublicCaseDetailSequence';
import { gotoPublicEmailVerificationInstructionsSequence } from './sequences/gotoPublicEmailVerificationInstructionsSequence';
import { gotoPublicEmailVerificationSuccessSequence } from './sequences/gotoPublicEmailVerificationSuccessSequence';
import { gotoPublicPrintableDocketRecordSequence } from './sequences/public/gotoPublicPrintableDocketRecordSequence';
import { gotoPublicSearchSequence } from './sequences/public/gotoPublicSearchSequence';
import { gotoTodaysOpinionsSequence } from './sequences/public/gotoTodaysOpinionsSequence';
import { gotoTodaysOrdersSequence } from './sequences/public/gotoTodaysOrdersSequence';
import { loadMoreTodaysOrdersSequence } from './sequences/loadMoreTodaysOrdersSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/public/navigateToPublicSiteSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openCaseDocumentDownloadUrlSequence } from './sequences/openCaseDocumentDownloadUrlSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { sortTodaysOrdersSequence } from './sequences/public/sortTodaysOrdersSequence';
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
  catch: [
    // ORDER MATTERS! Based on inheritance, the first match will be used
    [InvalidRequestError, setCurrentPageErrorSequence], // 418, other unknown 4xx series
    [ServerInvalidResponseError, setCurrentPageErrorSequence], // 501, 503, etc
    [NotFoundError, notFoundErrorSequence], //404
    [ActionError, setCurrentPageErrorSequence], // generic error handler
  ],
  providers: {},
  sequences: {
    advancedSearchTabChangeSequence,
    cerebralBindSimpleSetStateSequence,
    clearAdvancedSearchFormSequence,
    clearPdfPreviewUrlSequence,
    dismissModalSequence,
    gotoContactSequence,
    gotoHealthCheckSequence,
    gotoPrivacySequence,
    gotoPublicCaseDetailSequence,
    gotoPublicEmailVerificationInstructionsSequence,
    gotoPublicEmailVerificationSuccessSequence,
    gotoPublicPrintableDocketRecordSequence,
    gotoPublicSearchSequence,
    gotoTodaysOpinionsSequence,
    gotoTodaysOrdersSequence,
    loadMoreTodaysOrdersSequence,
    navigateBackSequence,
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    notFoundErrorSequence,
    openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence,
    sortTodaysOrdersSequence,
    submitPublicCaseAdvancedSearchSequence,
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

import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { closeModalAndNavigateToMaintenanceSequence } from './sequences/closeModalAndNavigateToMaintenanceSequence';
import { confirmSignUpSequence } from '@web-client/presenter/sequences/Login/confirmSignUpSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { displayProgressSpinnerSequence } from '@web-client/presenter/sequences/displayProgressSpinnerSequence';
import { goToCreatePetitionerAccountSequence } from '@web-client/presenter/sequences/Public/goToCreatePetitionerAccountSequence';
import { gotoContactSequence } from './sequences/gotoContactSequence';
import { gotoDawsonLibrarySequence } from './sequences/Public/gotoDawsonLibrarySequence';
import { gotoHealthCheckSequence } from './sequences/gotoHealthCheckSequence';
import { gotoMaintenanceSequence } from './sequences/gotoMaintenanceSequence';
import { gotoPrivacySequence } from './sequences/gotoPrivacySequence';
import { gotoPublicCaseDetailSequence } from './sequences/Public/gotoPublicCaseDetailSequence';
import { gotoPublicEmailVerificationInstructionsSequence } from './sequences/gotoPublicEmailVerificationInstructionsSequence';
import { gotoPublicPrintableDocketRecordSequence } from './sequences/Public/gotoPublicPrintableDocketRecordSequence';
import { gotoPublicSearchSequence } from './sequences/Public/gotoPublicSearchSequence';
import { gotoPublicTrialSessionDetailsSequence } from '@web-client/presenter/sequences/Public/gotoPublicTrialSessionDetailsSequence';
import { gotoPublicTrialSessionsSequence } from '@web-client/presenter/sequences/Public/gotoPublicTrialSessionsSequence';
import { gotoTodaysOpinionsSequence } from './sequences/Public/gotoTodaysOpinionsSequence';
import { gotoTodaysOrdersSequence } from './sequences/Public/gotoTodaysOrdersSequence';
import { gotoVerifyEmailSequence } from './sequences/Public/gotoVerifyEmailSequence';
import { initialPublicState } from './state-public';
import { loadMoreTodaysOrdersSequence } from './sequences/loadMoreTodaysOrdersSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { navigateToPublicSiteSequence } from './sequences/Public/navigateToPublicSiteSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openAppMaintenanceModalSequence } from './sequences/openAppMaintenanceModalSequence';
import { openAppUpdatedModalSequence } from '@web-client/presenter/sequences/openAppUpdatedModalSequence';
import { openCaseDocumentDownloadUrlSequence } from './sequences/openCaseDocumentDownloadUrlSequence';
import { persistFormsOnReloadSequence } from './sequences/persistFormsOnReloadSequence';
import { redirectToCreatePetitionerAccountSequence } from '@web-client/presenter/sequences/redirectToCreatePetitionerAccountSequence';
import { redirectToDashboardSequence } from '@web-client/presenter/sequences/redirectToDashboardSequence';
import { redirectToLoginSequence } from '@web-client/presenter/sequences/Public/redirectToLoginSequence';
import { resetPublicTrialSessionsDataSequence } from '@web-client/presenter/sequences/resetPublicTrialSessionsDataSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setCurrentPaginationPageSequence } from './sequences/setCurrentPaginationPageSequence';
import { setTodaysOrdersCurrentPaginationPageSequence } from './sequences/Public/setTodaysOrdersCurrentPaginationPageSequence';
import { showMaintenancePageDecorator } from './utilities/showMaintenancePageDecorator';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { sortTableSequence } from '@web-client/presenter/sequences/sortTableSequence';
import { submitLoginSequence } from '@web-client/presenter/sequences/Login/submitLoginSequence';
import { submitPractitionerBarNumberSearchSequence } from '@web-client/presenter/sequences/submitPractitionerBarNumberSearchSequence';
import { submitPractitionerNameSearchSequence } from '@web-client/presenter/sequences/submitPractitionerNameSearchSequence';
import { submitPublicCaseAdvancedSearchSequence } from './sequences/Public/submitPublicCaseAdvancedSearchSequence';
import { submitPublicCaseDocketNumberSearchSequence } from './sequences/Public/submitPublicCaseDocketNumberSearchSequence';
import { submitPublicOpinionAdvancedSearchSequence } from './sequences/Public/submitPublicOpinionAdvancedSearchSequence';
import { submitPublicOrderAdvancedSearchSequence } from './sequences/Public/submitPublicOrderAdvancedSearchSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleMobileDocketSortSequence } from './sequences/toggleMobileDocketSortSequence';
import { toggleShowPasswordSequence } from '@web-client/presenter/sequences/toggleShowPasswordSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedOpinionSearchFormValueSequence } from './sequences/updateAdvancedOpinionSearchFormValueSequence';
import { updateAdvancedOrderSearchFormValueSequence } from './sequences/updateAdvancedOrderSearchFormValueSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateCaseAdvancedSearchByNameFormValueSequence } from './sequences/updateCaseAdvancedSearchByNameFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { updateDocumentSearchResultsSequence } from './sequences/updateDocumentSearchResultsSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateSessionMetadataSequence } from './sequences/updateSessionMetadataSequence';
import { validateCaseAdvancedSearchFormSequence } from './sequences/validateCaseAdvancedSearchFormSequence';
import { validateCaseDocketNumberSearchFormSequence } from './sequences/validateCaseDocketNumberSearchFormSequence';
import { validateOpinionSearchSequence } from './sequences/validateOpinionSearchSequence';
import { validateOrderSearchSequence } from './sequences/validateOrderSearchSequence';
import { validatePractitionerSearchByBarNumberFormSequence } from '@web-client/presenter/sequences/validatePractitionerSearchByBarNumberFormSequence';
import { validatePractitionerSearchByNameFormSequence } from '@web-client/presenter/sequences/validatePractitionerSearchByNameFormSequence';
import { openCleanModalSequence } from './sequences/openCleanModalSequence';

export const presenterSequences = {
  advancedSearchTabChangeSequence:
    advancedSearchTabChangeSequence as unknown as Function,
  cerebralBindSimpleSetStateSequence:
    cerebralBindSimpleSetStateSequence as unknown as Function,
  clearAdvancedSearchFormSequence:
    clearAdvancedSearchFormSequence as unknown as Function,
  clearPdfPreviewUrl: clearPdfPreviewUrlSequence as unknown as Function,
  closeModalAndNavigateToMaintenanceSequence:
    closeModalAndNavigateToMaintenanceSequence as unknown as Function,
  confirmSignUpSequence,
  dismissAlertSequence,
  dismissModalSequence: dismissModalSequence as unknown as Function,
  displayProgressSpinnerSequence,
  goToCreatePetitionerAccountSequence,
  gotoContactSequence: showMaintenancePageDecorator(gotoContactSequence),
  gotoDawsonLibrarySequence: gotoDawsonLibrarySequence as unknown as Function,
  gotoHealthCheckSequence: showMaintenancePageDecorator(
    gotoHealthCheckSequence,
  ),
  gotoMaintenanceSequence: gotoMaintenanceSequence as unknown as Function,
  gotoPrivacySequence: showMaintenancePageDecorator(gotoPrivacySequence),
  gotoPublicCaseDetailSequence: showMaintenancePageDecorator(
    gotoPublicCaseDetailSequence,
  ),
  gotoPublicEmailVerificationInstructionsSequence: showMaintenancePageDecorator(
    gotoPublicEmailVerificationInstructionsSequence,
  ),
  gotoPublicPrintableDocketRecordSequence,
  gotoPublicSearchSequence: showMaintenancePageDecorator(
    gotoPublicSearchSequence,
  ),
  gotoPublicTrialSessionDetailsSequence,
  gotoPublicTrialSessionsSequence,
  gotoTodaysOpinionsSequence: showMaintenancePageDecorator(
    gotoTodaysOpinionsSequence,
  ),
  gotoTodaysOrdersSequence: showMaintenancePageDecorator(
    gotoTodaysOrdersSequence,
  ),
  gotoVerifyEmailSequence,
  loadMoreTodaysOrdersSequence:
    loadMoreTodaysOrdersSequence as unknown as Function,
  navigateBackSequence: navigateBackSequence as unknown as Function,
  navigateToLoginSequence,
  navigateToPublicSiteSequence:
    navigateToPublicSiteSequence as unknown as Function,
  notFoundErrorSequence: notFoundErrorSequence as unknown as Function,
  openAppMaintenanceModalSequence:
    openAppMaintenanceModalSequence as unknown as Function,
  openAppUpdatedModalSequence,
  openCaseDocumentDownloadUrlSequence:
    openCaseDocumentDownloadUrlSequence as unknown as Function,
  openCleanModalSequence: openCleanModalSequence as unknown as Function,
  persistFormsOnReloadSequence:
    persistFormsOnReloadSequence as unknown as Function,
  redirectToCreatePetitionerAccountSequence:
    redirectToCreatePetitionerAccountSequence as unknown as Function,
  redirectToDashboardSequence:
    redirectToDashboardSequence as unknown as Function,
  redirectToLoginSequence,
  resetPublicTrialSessionsDataSequence,
  setCurrentPaginationPageSequence,
  setTodaysOrdersCurrentPaginationPageSequence,
  showMoreResultsSequence: showMoreResultsSequence as unknown as Function,
  sortTableSequence,
  submitLoginSequence,
  submitPractitionerBarNumberSearchSequence:
    submitPractitionerBarNumberSearchSequence as unknown as Function,
  submitPractitionerNameSearchSequence:
    submitPractitionerNameSearchSequence as unknown as Function,
  submitPublicCaseAdvancedSearchSequence:
    submitPublicCaseAdvancedSearchSequence as unknown as Function,
  submitPublicCaseDocketNumberSearchSequence:
    submitPublicCaseDocketNumberSearchSequence as unknown as Function,
  submitPublicOpinionAdvancedSearchSequence:
    submitPublicOpinionAdvancedSearchSequence as unknown as Function,
  submitPublicOrderAdvancedSearchSequence:
    submitPublicOrderAdvancedSearchSequence as unknown as Function,
  toggleBetaBarSequence: toggleBetaBarSequence as unknown as Function,
  toggleMobileDocketSortSequence:
    toggleMobileDocketSortSequence as unknown as Function,
  toggleShowPasswordSequence,
  toggleUsaBannerDetailsSequence:
    toggleUsaBannerDetailsSequence as unknown as Function,
  updateAdvancedOpinionSearchFormValueSequence:
    updateAdvancedOpinionSearchFormValueSequence as unknown as Function,
  updateAdvancedOrderSearchFormValueSequence:
    updateAdvancedOrderSearchFormValueSequence as unknown as Function,
  updateAdvancedSearchFormValueSequence:
    updateAdvancedSearchFormValueSequence as unknown as Function,
  updateCaseAdvancedSearchByNameFormValueSequence:
    updateCaseAdvancedSearchByNameFormValueSequence as unknown as Function,
  updateDocketNumberSearchFormSequence:
    updateDocketNumberSearchFormSequence as unknown as Function,
  updateDocumentSearchResultsSequence,
  updateFormValueSequence,
  updateSessionMetadataSequence,
  validateCaseAdvancedSearchFormSequence:
    validateCaseAdvancedSearchFormSequence as unknown as Function,
  validateCaseDocketNumberSearchFormSequence:
    validateCaseDocketNumberSearchFormSequence as unknown as Function,
  validateOpinionSearchSequence:
    validateOpinionSearchSequence as unknown as Function,
  validateOrderSearchSequence:
    validateOrderSearchSequence as unknown as Function,
  validatePractitionerSearchByBarNumberFormSequence:
    validatePractitionerSearchByBarNumberFormSequence as unknown as Function,
  validatePractitionerSearchByNameFormSequence:
    validatePractitionerSearchByNameFormSequence as unknown as Function,
};

export const presenter = {
  catch: [
    // ORDER MATTERS! Based on inheritance, the first match will be used
    [InvalidRequestError, setCurrentPageErrorSequence], // 418, other unknown 4xx series
    [ServerInvalidResponseError, setCurrentPageErrorSequence], // 501, 503, etc
    [NotFoundError, notFoundErrorSequence], //404
    [ActionError, setCurrentPageErrorSequence], // generic error handler
  ],
  providers: {
    applicationContext: {} as any,
    router: {} as any,
  },
  sequences: presenterSequences,
  state: initialPublicState,
};

export type PublicSequences = typeof presenterSequences;

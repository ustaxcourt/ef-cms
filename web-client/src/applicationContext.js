import ImageBlobReduce from 'image-blob-reduce';
const reduce = ImageBlobReduce({
  pica: ImageBlobReduce.pica({ features: ['js'] }),
});
import { BroadcastChannel } from 'broadcast-channel';
import {
  Case,
  caseHasServedDocketEntries,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  hasPartyWithServiceType,
  isUserIdRepresentedByPrivatePractitioner,
} from '../../shared/src/business/entities/cases/Case';
import {
  DocketEntry,
  getServedPartiesCode,
  isServed,
} from '../../shared/src/business/entities/DocketEntry';
import { ErrorFactory } from './presenter/errors/ErrorFactory';
import {
  chiefJudgeNameForSigning,
  clerkOfCourtNameForSigning,
  getCognitoLoginUrl,
  getEnvironment,
  getPublicSiteUrl,
  getUniqueId,
} from '../../shared/src/sharedAppContext.js';
import {
  compareISODateStrings,
  compareStrings,
} from '../../shared/src/business/utilities/sortFunctions';
import { fetchPendingItemsInteractor } from '../../shared/src/proxies/pendingItems/fetchPendingItemsProxy';
import { formatDollars } from '../../shared/src/business/utilities/formatDollars';
import {
  formatJudgeName,
  getJudgeLastName,
} from '../../shared/src/business/utilities/getFormattedJudgeName';
import { generatePrintableCaseInventoryReportInteractor } from '../../shared/src/proxies/reports/generatePrintableCaseInventoryReportProxy';
import { generatePrintablePendingReportInteractor } from '../../shared/src/proxies/pendingItems/generatePrintablePendingReportProxy';
import { getCompletedMessagesForSectionInteractor } from '../../shared/src/proxies/messages/getCompletedMessagesForSectionProxy';
import { getCompletedMessagesForUserInteractor } from '../../shared/src/proxies/messages/getCompletedMessagesForUserProxy';
import { getCropBox } from '../../shared/src/business/utilities/getCropBox';
import { getDocumentTitleWithAdditionalInfo } from '../../shared/src/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getIsFeatureEnabled } from '../../shared/src/business/utilities/getIsFeatureEnabled';
import { getStampBoxCoordinates } from '../../shared/src/business/utilities/getStampBoxCoordinates';
import { getUserPendingEmailStatusInteractor } from '../../shared/src/proxies/users/getUserPendingEmailStatusProxy';
import { setupPdfDocument } from '../../shared/src/business/utilities/setupPdfDocument';
const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('../../shared/src/business/utilities/getWorkQueueFilters');
import { getDocumentDownloadUrlInteractor } from '../../shared/src/proxies/getDocumentDownloadUrlProxy';
import { getHealthCheckInteractor } from '../../shared/src/proxies/health/getHealthCheckProxy';
import { getUserCaseNoteForCasesInteractor } from '../../shared/src/proxies/caseNote/getUserCaseNoteForCasesProxy';
import { validateDocumentInteractor } from '../../shared/src/business/useCases/validateDocumentInteractor';
const {
  getJudgeForUserChambersInteractor,
} = require('../../shared/src/business/useCases/users/getJudgeForUserChambersInteractor');
import { User } from '../../shared/src/business/entities/User';
import { addCaseToTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/addCaseToTrialSessionProxy';
import { addConsolidatedCaseInteractor } from '../../shared/src/proxies/addConsolidatedCaseProxy';
import { addCoversheetInteractor } from '../../shared/src/proxies/documents/addCoversheetProxy';
import { addDeficiencyStatisticInteractor } from '../../shared/src/proxies/caseStatistics/addDeficiencyStatisticProxy';
import { addPaperFilingInteractor } from '../../shared/src/proxies/documents/addPaperFilingProxy';
import { addPetitionerToCaseInteractor } from '../../shared/src/proxies/addPetitionerToCaseProxy';
import { aggregatePartiesForService } from '../../shared/src/business/utilities/aggregatePartiesForService';
import { archiveCorrespondenceDocumentInteractor } from '../../shared/src/proxies/correspondence/archiveCorrespondenceDocumentProxy';
import { archiveDraftDocumentInteractor } from '../../shared/src/proxies/archiveDraftDocumentProxy';
import { assignWorkItemsInteractor } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { associateIrsPractitionerWithCaseInteractor } from '../../shared/src/proxies/manualAssociation/associateIrsPractitionerWithCaseProxy';
import { associatePrivatePractitionerWithCaseInteractor } from '../../shared/src/proxies/manualAssociation/associatePrivatePractitionerWithCaseProxy';
import { authorizeCodeInteractor } from '../../shared/src/business/useCases/authorizeCodeInteractor';
import { batchDownloadTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/batchDownloadTrialSessionProxy';
import { blockCaseFromTrialInteractor } from '../../shared/src/proxies/blockCaseFromTrialProxy';
import {
  calculateISODate,
  checkDate,
  computeDate,
  createEndOfDayISO,
  createISODateString,
  createISODateStringFromObject,
  createStartOfDayISO,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  getMonthDayYearObj,
  isStringISOFormatted,
  isValidDateString,
  prepareDateFromString,
  validateDateAndCreateISO,
} from '../../shared/src/business/utilities/DateHandler';
import { canConsolidateInteractor } from '../../shared/src/business/useCases/caseConsolidation/canConsolidateInteractor';
import { canSetTrialSessionAsCalendaredInteractor } from '../../shared/src/business/useCases/trialSessions/canSetTrialSessionAsCalendaredInteractor';
import { caseAdvancedSearchInteractor } from '../../shared/src/proxies/caseAdvancedSearchProxy';
import { checkEmailAvailabilityInteractor } from '../../shared/src/proxies/users/checkEmailAvailabilityProxy';
import {
  compareCasesByDocketNumber,
  formatCase as formatCaseForTrialSession,
  formattedTrialSessionDetails,
  getTrialSessionStatus,
} from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { completeDocketEntryQCInteractor } from '../../shared/src/proxies/editDocketEntry/completeDocketEntryQCProxy';
import { completeMessageInteractor } from '../../shared/src/proxies/messages/completeMessageProxy';
import { completeWorkItemInteractor } from '../../shared/src/proxies/workitems/completeWorkItemProxy';
import { createCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/createCaseDeadlineProxy';
import { createCaseFromPaperInteractor } from '../../shared/src/proxies/createCaseFromPaperProxy';
import { createCaseInteractor } from '../../shared/src/proxies/createCaseProxy';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '../../shared/src/proxies/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlProxy';
import { createJudgeUserInteractor } from '../../shared/src/proxies/judges/createJudgeUserProxy';
import { createMessageInteractor } from '../../shared/src/proxies/messages/createMessageProxy';
import { createPractitionerUserInteractor } from '../../shared/src/proxies/practitioners/createPractitionerUserProxy';
import { createTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/createTrialSessionProxy';
import { deleteCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/deleteCaseDeadlineProxy';
import { deleteCaseNoteInteractor } from '../../shared/src/proxies/caseNote/deleteCaseNoteProxy';
import { deleteCounselFromCaseInteractor } from '../../shared/src/proxies/caseAssociation/deleteCounselFromCaseProxy';
import { deleteDeficiencyStatisticInteractor } from '../../shared/src/proxies/caseStatistics/deleteDeficiencyStatisticProxy';
import { deleteTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/deleteTrialSessionProxy';
import { deleteUserCaseNoteInteractor } from '../../shared/src/proxies/caseNote/deleteUserCaseNoteProxy';
import { editPaperFilingInteractor } from '../../shared/src/proxies/documents/editPaperFilingProxy';
import { fileAndServeCourtIssuedDocumentInteractor } from '../../shared/src/proxies/documents/fileAndServeCourtIssuedDocumentProxy';
import { fileCorrespondenceDocumentInteractor } from '../../shared/src/proxies/correspondence/fileCorrespondenceDocumentProxy';
import { fileCourtIssuedDocketEntryInteractor } from '../../shared/src/proxies/documents/fileCourtIssuedDocketEntryProxy';
import { fileCourtIssuedOrderInteractor } from '../../shared/src/proxies/courtIssuedOrder/fileCourtIssuedOrderProxy';
import { fileExternalDocumentForConsolidatedInteractor } from '../../shared/src/proxies/documents/fileExternalDocumentForConsolidatedProxy';
import { fileExternalDocumentInteractor } from '../../shared/src/proxies/documents/fileExternalDocumentProxy';
import { filePetitionFromPaperInteractor } from '../../shared/src/business/useCases/filePetitionFromPaperInteractor';
import { filePetitionInteractor } from '../../shared/src/business/useCases/filePetitionInteractor';
import { filterEmptyStrings } from '../../shared/src/business/utilities/filterEmptyStrings';
import { formatAttachments } from '../../shared/src/business/utilities/formatAttachments';
import {
  formatCase,
  formatDocketEntry,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketEntries,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { forwardMessageInteractor } from '../../shared/src/proxies/messages/forwardMessageProxy';
import { generateCaseAssociationDocumentTitleInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/generateCaseAssociationDocumentTitleInteractor';
import { generateCourtIssuedDocumentTitleInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/generateCourtIssuedDocumentTitleInteractor';
import { generateDocketRecordPdfInteractor } from '../../shared/src/proxies/generateDocketRecordPdfProxy';
import { generateDocumentTitleInteractor } from '../../shared/src/business/useCases/externalDocument/generateDocumentTitleInteractor';
import { generatePDFFromJPGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromJPGDataInteractor';
import { generatePractitionerCaseListPdfInteractor } from '../../shared/src/proxies/practitioners/generatePractitionerCaseListPdfProxy';
import { generatePrintableFilingReceiptInteractor } from '../../shared/src/proxies/generatePrintableFilingReceiptProxy';
import { generateSignedDocumentInteractor } from '../../shared/src/business/useCases/generateSignedDocumentInteractor';
import { generateTrialCalendarPdfInteractor } from '../../shared/src/proxies/trialSessions/generateTrialCalendarPdfProxy';
import { getBlockedCasesInteractor } from '../../shared/src/proxies/reports/getBlockedCasesProxy';
import { getCalendaredCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getCalendaredCasesForTrialSessionProxy';
import { getCaseDeadlinesForCaseInteractor } from '../../shared/src/proxies/caseDeadline/getCaseDeadlinesForCaseProxy';
import { getCaseDeadlinesInteractor } from '../../shared/src/proxies/caseDeadline/getCaseDeadlinesProxy';
import { getCaseInteractor } from '../../shared/src/proxies/getCaseProxy';
import { getCaseInventoryReportInteractor } from '../../shared/src/proxies/reports/getCaseInventoryReportProxy';
import {
  getChambersSections,
  getChambersSectionsLabels,
} from '../../shared/src/persistence/dynamo/chambers/getJudgesChambers';
import { getClosedCasesInteractor } from '../../shared/src/proxies/getClosedCasesProxy';
import { getConsolidatedCasesByCaseInteractor } from '../../shared/src/proxies/getConsolidatedCasesByCaseProxy';
import { getDocument } from '../../shared/src/persistence/s3/getDocument';
import { getDocumentContentsForDocketEntryInteractor } from '../../shared/src/proxies/documents/getDocumentContentsForDocketEntryProxy';
import { getDocumentQCInboxForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { getDocumentQCInboxForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCInboxForUserProxy';
import { getDocumentQCServedForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCServedForSectionProxy';
import { getDocumentQCServedForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCServedForUserProxy';
import { getEligibleCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getEligibleCasesForTrialSessionProxy';
import { getFormattedPartiesNameAndTitle } from '../../shared/src/business/utilities/getFormattedPartiesNameAndTitle';
import { getInboxMessagesForSectionInteractor } from '../../shared/src/proxies/messages/getInboxMessagesForSectionProxy';
import { getInboxMessagesForUserInteractor } from '../../shared/src/proxies/messages/getInboxMessagesForUserProxy';
import { getInternalUsersInteractor } from '../../shared/src/proxies/users/getInternalUsersProxy';
import { getIrsPractitionersBySearchKeyInteractor } from '../../shared/src/proxies/users/getIrsPractitionersBySearchKeyProxy';
import { getItem } from '../../shared/src/persistence/localStorage/getItem';
import { getItemInteractor } from '../../shared/src/business/useCases/getItemInteractor';
import { getMessageThreadInteractor } from '../../shared/src/proxies/messages/getMessageThreadProxy';
import { getMessagesForCaseInteractor } from '../../shared/src/proxies/messages/getMessagesForCaseProxy';
import { getNotificationsInteractor } from '../../shared/src/proxies/users/getNotificationsProxy';
import { getOpenConsolidatedCasesInteractor } from '../../shared/src/proxies/getOpenConsolidatedCasesProxy';
import { getOutboxMessagesForSectionInteractor } from '../../shared/src/proxies/messages/getOutboxMessagesForSectionProxy';
import { getOutboxMessagesForUserInteractor } from '../../shared/src/proxies/messages/getOutboxMessagesForUserProxy';
import { getPdfFromUrl } from '../../shared/src/persistence/s3/getPdfFromUrl';
import { getPdfFromUrlInteractor } from '../../shared/src/business/useCases/document/getPdfFromUrlInteractor';
import { getPractitionerByBarNumberInteractor } from '../../shared/src/proxies/users/getPractitionerByBarNumberProxy';
import { getPractitionersByNameInteractor } from '../../shared/src/proxies/practitioners/getPractitionersByNameProxy';
import { getPrivatePractitionersBySearchKeyInteractor } from '../../shared/src/proxies/users/getPrivatePractitionersBySearchKeyProxy';
import { getStatusOfVirusScanInteractor } from '../../shared/src/proxies/documents/getStatusOfVirusScanProxy';
import { getTrialSessionDetailsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionDetailsProxy';
import { getTrialSessionWorkingCopyInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionWorkingCopyProxy';
import { getTrialSessionsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionsProxy';
import { getUserByIdInteractor } from '../../shared/src/proxies/users/getUserByIdProxy';
import { getUserCaseNoteInteractor } from '../../shared/src/proxies/caseNote/getUserCaseNoteProxy';
import { getUserInteractor } from '../../shared/src/proxies/users/getUserProxy';
import { getUserPendingEmailInteractor } from '../../shared/src/proxies/users/getUserPendingEmailProxy';
import { getUserPermissions } from '../../shared/src/authorization/getUserPermissions';
import { getUsersInSectionInteractor } from '../../shared/src/proxies/users/getUsersInSectionProxy';
import { getUsersPendingEmailInteractor } from '../../shared/src/proxies/users/getUsersPendingEmailProxy';
import { getWorkItemInteractor } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { loadPDFForPreviewInteractor } from '../../shared/src/business/useCases/loadPDFForPreviewInteractor';
import { loadPDFForSigningInteractor } from '../../shared/src/business/useCases/loadPDFForSigningInteractor';
import { opinionAdvancedSearchInteractor } from '../../shared/src/proxies/opinionAdvancedSearchProxy';
import { orderAdvancedSearchInteractor } from '../../shared/src/proxies/orderAdvancedSearchProxy';
import { prioritizeCaseInteractor } from '../../shared/src/proxies/prioritizeCaseProxy';
import { refreshTokenInteractor } from '../../shared/src/business/useCases/refreshTokenInteractor';
import { removeCaseFromTrialInteractor } from '../../shared/src/proxies/trialSessions/removeCaseFromTrialProxy';
import { removeCasePendingItemInteractor } from '../../shared/src/proxies/removeCasePendingItemProxy';
import { removeConsolidatedCasesInteractor } from '../../shared/src/proxies/removeConsolidatedCasesProxy';
import { removeItem } from '../../shared/src/persistence/localStorage/removeItem';
import { removeItemInteractor } from '../../shared/src/business/useCases/removeItemInteractor';
import { removePdfFromDocketEntryInteractor } from '../../shared/src/proxies/documents/removePdfFromDocketEntryProxy';
import { removePetitionerAndUpdateCaptionInteractor } from '../../shared/src/proxies/removePetitionerAndUpdateCaptionProxy';
import { removeSignatureFromDocumentInteractor } from '../../shared/src/proxies/documents/removeSignatureFromDocumentProxy';
import { replaceBracketed } from '../../shared/src/business/utilities/replaceBracketed';
import { replyToMessageInteractor } from '../../shared/src/proxies/messages/replyToMessageProxy';
import { runTrialSessionPlanningReportInteractor } from '../../shared/src/proxies/trialSessions/runTrialSessionPlanningReportProxy';
import { saveCalendarNoteInteractor } from '../../shared/src/proxies/trialSessions/saveCalendarNoteProxy';
import { saveCaseDetailInternalEditInteractor } from '../../shared/src/proxies/saveCaseDetailInternalEditProxy';
import { saveCaseNoteInteractor } from '../../shared/src/proxies/caseNote/saveCaseNoteProxy';
import { saveSignedDocumentInteractor } from '../../shared/src/proxies/documents/saveSignedDocumentProxy';
import { sealCaseContactAddressInteractor } from '../../shared/src/proxies/sealCaseContactAddressProxy';
import { sealCaseInteractor } from '../../shared/src/proxies/sealCaseProxy';
import { serveCaseToIrsInteractor } from '../../shared/src/proxies/serveCaseToIrs/serveCaseToIrsProxy';
import { serveCourtIssuedDocumentInteractor } from '../../shared/src/proxies/serveCourtIssuedDocumentProxy';
import { serveExternallyFiledDocumentInteractor } from '../../shared/src/proxies/documents/serveExternallyFiledDocumentProxy';
import { setForHearingInteractor } from '../../shared/src/proxies/trialSessions/setForHearingProxy';
import { setItem } from '../../shared/src/persistence/localStorage/setItem';
import { setItemInteractor } from '../../shared/src/business/useCases/setItemInteractor';
import { setMessageAsReadInteractor } from '../../shared/src/proxies/messages/setMessageAsReadProxy';
import { setNoticesForCalendaredTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/setNoticesForCalendaredTrialSessionProxy';
import { setServiceIndicatorsForCase } from '../../shared/src/business/utilities/setServiceIndicatorsForCase';
import { setTrialSessionAsSwingSessionInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionAsSwingSessionProxy';
import { setTrialSessionCalendarInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionCalendarProxy';
import { setWorkItemAsReadInteractor } from '../../shared/src/proxies/workitems/setWorkItemAsReadProxy';
import { strikeDocketEntryInteractor } from '../../shared/src/proxies/editDocketEntry/strikeDocketEntryProxy';
import { submitCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitCaseAssociationRequestProxy';
import { submitPendingCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitPendingCaseAssociationRequestProxy';
import { tryCatchDecorator } from './tryCatchDecorator';
import { unblockCaseFromTrialInteractor } from '../../shared/src/proxies/unblockCaseFromTrialProxy';
import { unprioritizeCaseInteractor } from '../../shared/src/proxies/unprioritizeCaseProxy';
import { updateCaseContextInteractor } from '../../shared/src/proxies/updateCaseContextProxy';
import { updateCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/updateCaseDeadlineProxy';
import { updateCaseDetailsInteractor } from '../../shared/src/proxies/updateCaseDetailsProxy';
import { updateCaseTrialSortTagsInteractor } from '../../shared/src/proxies/updateCaseTrialSortTagsProxy';
import { updateContactInteractor } from '../../shared/src/proxies/updateContactProxy';
import { updateCorrespondenceDocumentInteractor } from '../../shared/src/proxies/correspondence/updateCorrespondenceDocumentProxy';
import { updateCounselOnCaseInteractor } from '../../shared/src/proxies/caseAssociation/updateCounselOnCaseProxy';
import { updateCourtIssuedDocketEntryInteractor } from '../../shared/src/proxies/documents/updateCourtIssuedDocketEntryProxy';
import { updateCourtIssuedOrderInteractor } from '../../shared/src/proxies/courtIssuedOrder/updateCourtIssuedOrderProxy';
import { updateDeficiencyStatisticInteractor } from '../../shared/src/proxies/caseStatistics/updateDeficiencyStatisticProxy';
import { updateDocketEntryMetaInteractor } from '../../shared/src/proxies/documents/updateDocketEntryMetaProxy';
import { updateOtherStatisticsInteractor } from '../../shared/src/proxies/caseStatistics/updateOtherStatisticsProxy';
import { updatePetitionerInformationInteractor } from '../../shared/src/proxies/updatePetitionerInformationProxy';
import { updatePractitionerUserInteractor } from '../../shared/src/proxies/practitioners/updatePractitionerUserProxy';
import { updateQcCompleteForTrialInteractor } from '../../shared/src/proxies/updateQcCompleteForTrialProxy';
import { updateTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/updateTrialSessionProxy';
import { updateTrialSessionWorkingCopyInteractor } from '../../shared/src/proxies/trialSessions/updateTrialSessionWorkingCopyProxy';
import { updateUserCaseNoteInteractor } from '../../shared/src/proxies/caseNote/updateUserCaseNoteProxy';
import { updateUserContactInformationInteractor } from '../../shared/src/proxies/users/updateUserContactInformationProxy';
import { updateUserPendingEmailInteractor } from '../../shared/src/proxies/users/updateUserPendingEmailProxy';
import { uploadCorrespondenceDocumentInteractor } from '../../shared/src/business/useCases/correspondence/uploadCorrespondenceDocumentInteractor';
import { uploadDocumentAndMakeSafeInteractor } from '../../shared/src/business/useCases/uploadDocumentAndMakeSafeInteractor';
import { uploadDocumentFromClient } from '../../shared/src/persistence/s3/uploadDocumentFromClient';
import { uploadDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadDocumentInteractor';
import { uploadExternalDocumentsInteractor } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentsInteractor';
import { uploadOrderDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadOrderDocumentInteractor';
import { uploadPdfFromClient } from '../../shared/src/persistence/s3/uploadPdfFromClient';
import { validateAddDeficiencyStatisticsInteractor } from '../../shared/src/business/useCases/validateAddDeficiencyStatisticsInteractor';
import { validateAddIrsPractitionerInteractor } from '../../shared/src/business/useCases/caseAssociation/validateAddIrsPractitionerInteractor';
import { validateAddPetitionerInteractor } from '../../shared/src/business/useCases/validateAddPetitionerInteractor';
import { validateAddPractitionerInteractor } from '../../shared/src/business/useCases/practitioners/validateAddPractitionerInteractor';
import { validateAddPrivatePractitionerInteractor } from '../../shared/src/business/useCases/caseAssociation/validateAddPrivatePractitionerInteractor';
import { validateCalendarNoteInteractor } from '../../shared/src/business/useCases/validateCalendarNoteInteractor';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import { validateCaseAssociationRequestInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/validateCaseAssociationRequestInteractor';
import { validateCaseDeadlineInteractor } from '../../shared/src/business/useCases/caseDeadline/validateCaseDeadlineInteractor';
import { validateCaseDetailInteractor } from '../../shared/src/business/useCases/validateCaseDetailInteractor';
import { validateCourtIssuedDocketEntryInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/validateCourtIssuedDocketEntryInteractor';
import { validateCreateMessageInteractor } from '../../shared/src/business/useCases/messages/validateCreateMessageInteractor';
import { validateDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/validateDocketEntryInteractor';
import { validateEditPetitionerCounselInteractor } from '../../shared/src/business/useCases/caseAssociation/validateEditPetitionerCounselInteractor';
import { validateExternalDocumentInformationInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInformationInteractor';
import { validateExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInteractor';
import { validateHearingNoteInteractor } from '../../shared/src/business/useCases/validateHearingNoteInteractor';
import { validateNoteInteractor } from '../../shared/src/business/useCases/caseNote/validateNoteInteractor';
import { validateOpinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOpinionAdvancedSearchInteractor';
import { validateOrderAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOrderAdvancedSearchInteractor';
import { validateOrderWithoutBodyInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/validateOrderWithoutBodyInteractor';
import { validatePdfInteractor } from '../../shared/src/proxies/documents/validatePdfProxy';
import { validatePetitionFromPaperInteractor } from '../../shared/src/business/useCases/validatePetitionFromPaperInteractor';
import { validatePetitionInteractor } from '../../shared/src/business/useCases/validatePetitionInteractor';
import { validatePetitionerInformationFormInteractor } from '../../shared/src/business/useCases/validatePetitionerInformationFormInteractor';
import { validatePetitionerInteractor } from '../../shared/src/business/useCases/validatePetitionerInteractor';
import { validatePractitionerInteractor } from '../../shared/src/business/useCases/practitioners/validatePractitionerInteractor';
import { validateSearchDeadlinesInteractor } from '../../shared/src/business/useCases/validateSearchDeadlinesInteractor';
import { validateStartCaseWizardInteractor } from '../../shared/src/business/useCases/startCase/validateStartCaseWizardInteractor';
import { validateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/validateTrialSessionInteractor';
import { validateUpdateUserEmailInteractor } from '../../shared/src/business/useCases/validateUpdateUserEmailInteractor';
import { validateUserContactInteractor } from '../../shared/src/business/useCases/users/validateUserContactInteractor';
import { verifyPendingCaseForUserInteractor } from '../../shared/src/proxies/verifyPendingCaseForUserProxy';
import { verifyUserPendingEmailInteractor } from '../../shared/src/proxies/users/verifyUserPendingEmailProxy';
import axios from 'axios';
import deepFreeze from 'deep-freeze';

import { getConstants } from './getConstants';

let user;
let broadcastChannel;

const getCurrentUser = () => {
  return user;
};
const setCurrentUser = newUser => {
  user = newUser;
};

let token;
const getCurrentUserToken = () => {
  return token;
};
const setCurrentUserToken = newToken => {
  token = newToken;
};

const allUseCases = {
  addCaseToTrialSessionInteractor,
  addConsolidatedCaseInteractor,
  addCoversheetInteractor,
  addDeficiencyStatisticInteractor,
  addPaperFilingInteractor,
  addPetitionerToCaseInteractor,
  archiveCorrespondenceDocumentInteractor,
  archiveDraftDocumentInteractor,
  assignWorkItemsInteractor,
  associateIrsPractitionerWithCaseInteractor,
  associatePrivatePractitionerWithCaseInteractor,
  authorizeCodeInteractor,
  batchDownloadTrialSessionInteractor,
  blockCaseFromTrialInteractor,
  canConsolidateInteractor,
  canSetTrialSessionAsCalendaredInteractor,
  caseAdvancedSearchInteractor,
  checkEmailAvailabilityInteractor,
  completeDocketEntryQCInteractor,
  completeMessageInteractor,
  completeWorkItemInteractor,
  createCaseDeadlineInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createJudgeUserInteractor,
  createMessageInteractor,
  createPractitionerUserInteractor,
  createTrialSessionInteractor,
  deleteCaseDeadlineInteractor,
  deleteCaseNoteInteractor,
  deleteCounselFromCaseInteractor,
  deleteDeficiencyStatisticInteractor,
  deleteTrialSessionInteractor,
  deleteUserCaseNoteInteractor,
  editPaperFilingInteractor,
  fetchPendingItemsInteractor,
  fileAndServeCourtIssuedDocumentInteractor,
  fileCorrespondenceDocumentInteractor,
  fileCourtIssuedDocketEntryInteractor,
  fileCourtIssuedOrderInteractor,
  fileExternalDocumentForConsolidatedInteractor,
  fileExternalDocumentInteractor,
  filePetitionFromPaperInteractor,
  filePetitionInteractor,
  forwardMessageInteractor,
  generateCaseAssociationDocumentTitleInteractor,
  generateCourtIssuedDocumentTitleInteractor,
  generateDocketRecordPdfInteractor,
  generateDocumentTitleInteractor,
  generatePDFFromJPGDataInteractor,
  generatePractitionerCaseListPdfInteractor,
  generatePrintableCaseInventoryReportInteractor,
  generatePrintableFilingReceiptInteractor,
  generatePrintablePendingReportInteractor,
  generateSignedDocumentInteractor,
  generateTrialCalendarPdfInteractor,
  getBlockedCasesInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseDeadlinesForCaseInteractor,
  getCaseDeadlinesInteractor,
  getCaseInteractor,
  getCaseInventoryReportInteractor,
  getClosedCasesInteractor,
  getCompletedMessagesForSectionInteractor,
  getCompletedMessagesForUserInteractor,
  getConsolidatedCasesByCaseInteractor,
  getDocumentContentsForDocketEntryInteractor,
  getDocumentDownloadUrlInteractor,
  getDocumentQCInboxForSectionInteractor,
  getDocumentQCInboxForUserInteractor,
  getDocumentQCServedForSectionInteractor,
  getDocumentQCServedForUserInteractor,
  getEligibleCasesForTrialSessionInteractor,
  getHealthCheckInteractor,
  getInboxMessagesForSectionInteractor,
  getInboxMessagesForUserInteractor,
  getInternalUsersInteractor,
  getIrsPractitionersBySearchKeyInteractor,
  getItemInteractor,
  getJudgeForUserChambersInteractor,
  getMessageThreadInteractor,
  getMessagesForCaseInteractor,
  getNotificationsInteractor,
  getOpenConsolidatedCasesInteractor,
  getOutboxMessagesForSectionInteractor,
  getOutboxMessagesForUserInteractor,
  getPdfFromUrlInteractor,
  getPractitionerByBarNumberInteractor,
  getPractitionersByNameInteractor,
  getPrivatePractitionersBySearchKeyInteractor,
  getStatusOfVirusScanInteractor: (applicationContext, args) =>
    process.env.SKIP_VIRUS_SCAN
      ? null
      : getStatusOfVirusScanInteractor(applicationContext, args),
  getTrialSessionDetailsInteractor,
  getTrialSessionWorkingCopyInteractor,
  getTrialSessionsInteractor,
  getUserByIdInteractor,
  getUserCaseNoteForCasesInteractor,
  getUserCaseNoteInteractor,
  getUserInteractor,
  getUserPendingEmailInteractor,
  getUserPendingEmailStatusInteractor,
  getUsersInSectionInteractor,
  getUsersPendingEmailInteractor,
  getWorkItemInteractor,
  loadPDFForPreviewInteractor,
  loadPDFForSigningInteractor,
  opinionAdvancedSearchInteractor,
  orderAdvancedSearchInteractor,
  prioritizeCaseInteractor,
  refreshTokenInteractor,
  removeCaseFromTrialInteractor,
  removeCasePendingItemInteractor,
  removeConsolidatedCasesInteractor,
  removeItemInteractor,
  removePdfFromDocketEntryInteractor,
  removePetitionerAndUpdateCaptionInteractor,
  removeSignatureFromDocumentInteractor,
  replyToMessageInteractor,
  runTrialSessionPlanningReportInteractor,
  saveCalendarNoteInteractor,
  saveCaseDetailInternalEditInteractor,
  saveCaseNoteInteractor,
  saveSignedDocumentInteractor,
  sealCaseContactAddressInteractor,
  sealCaseInteractor,
  serveCaseToIrsInteractor,
  serveCourtIssuedDocumentInteractor,
  serveExternallyFiledDocumentInteractor,
  setForHearingInteractor,
  setItemInteractor,
  setMessageAsReadInteractor,
  setNoticesForCalendaredTrialSessionInteractor,
  setTrialSessionAsSwingSessionInteractor,
  setTrialSessionCalendarInteractor,
  setWorkItemAsReadInteractor,
  strikeDocketEntryInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  unblockCaseFromTrialInteractor,
  unprioritizeCaseInteractor,
  updateCaseContextInteractor,
  updateCaseDeadlineInteractor,
  updateCaseDetailsInteractor,
  updateCaseTrialSortTagsInteractor,
  updateContactInteractor,
  updateCorrespondenceDocumentInteractor,
  updateCounselOnCaseInteractor,
  updateCourtIssuedDocketEntryInteractor,
  updateCourtIssuedOrderInteractor,
  updateDeficiencyStatisticInteractor,
  updateDocketEntryMetaInteractor,
  updateOtherStatisticsInteractor,
  updatePetitionerInformationInteractor,
  updatePractitionerUserInteractor,
  updateQcCompleteForTrialInteractor,
  updateTrialSessionInteractor,
  updateTrialSessionWorkingCopyInteractor,
  updateUserCaseNoteInteractor,
  updateUserContactInformationInteractor,
  updateUserPendingEmailInteractor,
  uploadCorrespondenceDocumentInteractor,
  uploadDocumentAndMakeSafeInteractor,
  uploadDocumentInteractor,
  uploadExternalDocumentsInteractor,
  uploadOrderDocumentInteractor,
  validateAddDeficiencyStatisticsInteractor,
  validateAddIrsPractitionerInteractor,
  validateAddPetitionerInteractor,
  validateAddPractitionerInteractor,
  validateAddPrivatePractitionerInteractor,
  validateCalendarNoteInteractor,
  validateCaseAdvancedSearchInteractor,
  validateCaseAssociationRequestInteractor,
  validateCaseDeadlineInteractor,
  validateCaseDetailInteractor,
  validateCourtIssuedDocketEntryInteractor,
  validateCreateMessageInteractor,
  validateDocketEntryInteractor,
  validateDocumentInteractor,
  validateEditPetitionerCounselInteractor,
  validateExternalDocumentInformationInteractor,
  validateExternalDocumentInteractor,
  validateHearingNoteInteractor,
  validateNoteInteractor,
  validateOpinionAdvancedSearchInteractor,
  validateOrderAdvancedSearchInteractor,
  validateOrderWithoutBodyInteractor,
  validatePdfInteractor,
  validatePetitionFromPaperInteractor,
  validatePetitionInteractor,
  validatePetitionerInformationFormInteractor,
  validatePetitionerInteractor,
  validatePractitionerInteractor,
  validateSearchDeadlinesInteractor,
  validateStartCaseWizardInteractor,
  validateTrialSessionInteractor,
  validateUpdateUserEmailInteractor,
  validateUserContactInteractor,
  verifyPendingCaseForUserInteractor,
  verifyUserPendingEmailInteractor,
};
tryCatchDecorator(allUseCases);

const appConstants = (process.env.USTC_DEBUG ? i => i : deepFreeze)(
  getConstants(),
);

const applicationContext = {
  convertBlobToUInt8Array: async blob => {
    return new Uint8Array(await new Response(blob).arrayBuffer());
  },
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:4000';
  },
  getBroadcastGateway: () => {
    if (!broadcastChannel) {
      broadcastChannel = new BroadcastChannel(getConstants().CHANNEL_NAME);
    }
    return broadcastChannel;
  },
  getCaseTitle: Case.getCaseTitle,
  getChiefJudgeNameForSigning: () => chiefJudgeNameForSigning,
  getClerkOfCourtNameForSigning: () => clerkOfCourtNameForSigning,
  getCognitoClientId: () => {
    return process.env.COGNITO_CLIENT_ID || '6tu6j1stv5ugcut7dqsqdurn8q';
  },
  getCognitoLoginUrl,
  getCognitoRedirectUrl: () => {
    return process.env.COGNITO_REDIRECT_URI || 'http://localhost:1234/log-in';
  },
  getCognitoTokenUrl: () => {
    return (
      process.env.COGNITO_TOKEN_URL ||
      'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/oauth2/token'
    );
  },
  getConstants: () => appConstants,
  getCurrentUser,
  getCurrentUserPermissions: () => {
    const currentUser = getCurrentUser();
    return getUserPermissions(currentUser);
  },
  getCurrentUserToken,
  getEnvironment,
  getError: e => {
    return ErrorFactory.getError(e);
  },
  getFileReaderInstance: () => new FileReader(),
  getHttpClient: () => axios,
  getLogger: () => ({
    error: value => {
      // eslint-disable-next-line no-console
      console.error(value);
    },
    info: (key, value) => {
      // eslint-disable-next-line no-console
      console.info(key, JSON.stringify(value));
    },
    time: key => {
      // eslint-disable-next-line no-console
      console.time(key);
    },
    timeEnd: key => {
      // eslint-disable-next-line no-console
      console.timeEnd(key);
    },
  }),
  getPdfJs: async () => {
    const pdfjsLib = await import('pdfjs-dist');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    return pdfjsLib;
  },
  getPdfLib: () => {
    const pdfLib = import('pdf-lib');
    return pdfLib;
  },
  getPersistenceGateway: () => {
    return {
      getChambersSections,
      getChambersSectionsLabels,
      getDocument,
      getItem,
      getPdfFromUrl,
      removeItem,
      setItem,
      uploadDocumentFromClient,
      uploadPdfFromClient,
    };
  },
  getPublicSiteUrl,
  getReduceImageBlob: () => reduce,
  getScanner: async () => {
    if (process.env.NO_SCANNER) {
      const scanner = await import(
        '../../shared/src/persistence/dynamsoft/getScannerMockInterface'
      );
      return scanner.getScannerInterface();
    } else {
      const scanner = await import(
        '../../shared/src/persistence/dynamsoft/getScannerInterface'
      );
      return scanner.getScannerInterface();
    }
  },
  getScannerResourceUri: () => {
    return (
      process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
    );
  },
  getUniqueId,
  getUseCases: () => allUseCases,
  getUserPermissions,
  getUtilities: () => {
    return {
      aggregatePartiesForService,
      calculateISODate,
      caseHasServedDocketEntries,
      checkDate,
      compareCasesByDocketNumber,
      compareISODateStrings,
      compareStrings,
      computeDate,
      createEndOfDayISO,
      createISODateString,
      createISODateStringFromObject,
      createStartOfDayISO,
      dateStringsCompared,
      deconstructDate,
      filterEmptyStrings,
      formatAttachments,
      formatCase,
      formatCaseForTrialSession,
      formatDateString,
      formatDocketEntry,
      formatDollars,
      formatJudgeName,
      formatNow,
      formattedTrialSessionDetails,
      getAttachmentDocumentById: Case.getAttachmentDocumentById,
      getCaseCaption: Case.getCaseCaption,
      getContactPrimary,
      getContactSecondary,
      getCropBox,
      getDocQcSectionForUser,
      getDocumentTitleWithAdditionalInfo,
      getFilingsAndProceedings,
      getFormattedCaseDetail,
      getFormattedPartiesNameAndTitle,
      getJudgeLastName,
      getMonthDayYearObj,
      getOtherFilers,
      getPetitionDocketEntry,
      getPetitionerById,
      getPractitionersRepresenting,
      getServedPartiesCode,
      getStampBoxCoordinates,
      getTrialSessionStatus,
      getWorkQueueFilters,
      hasPartyWithServiceType,
      isExternalUser: User.isExternalUser,
      isInternalUser: User.isInternalUser,
      isPending: DocketEntry.isPending,
      isPendingOnCreation: DocketEntry.isPendingOnCreation,
      isServed,
      isStringISOFormatted,
      isUserIdRepresentedByPrivatePractitioner,
      isValidDateString,
      prepareDateFromString,
      replaceBracketed,
      setServiceIndicatorsForCase,
      setupPdfDocument,
      sortDocketEntries,
      validateDateAndCreateISO,
    };
  },
  isFeatureEnabled: featureName => {
    return getIsFeatureEnabled(featureName, user, getEnvironment().stage);
  },
  setCurrentUser,
  setCurrentUserToken,
};

export { applicationContext };

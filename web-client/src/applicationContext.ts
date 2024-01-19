/* eslint-disable max-lines */
import { BroadcastChannel } from 'broadcast-channel';
import {
  Case,
  canAllowDocumentServiceForCase,
  caseHasServedDocketEntries,
  caseHasServedPetition,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  hasPartyWithServiceType,
  isClosed,
  isLeadCase,
  isSealedCase,
  isUserPartOfGroup,
  userIsDirectlyAssociated,
} from '../../shared/src/business/entities/cases/Case';
import {
  DocketEntry,
  getServedPartiesCode,
} from '../../shared/src/business/entities/DocketEntry';
import {
  ERROR_MAP_429,
  getEnvironment,
  getPublicSiteUrl,
  getUniqueId,
} from '../../shared/src/sharedAppContext';
import { ErrorFactory } from './presenter/errors/ErrorFactory';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser, User } from '../../shared/src/business/entities/User';
import { abbreviateState } from '../../shared/src/business/utilities/abbreviateState';
import { addCaseToTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/addCaseToTrialSessionProxy';
import { addConsolidatedCaseInteractor } from '../../shared/src/proxies/addConsolidatedCaseProxy';
import { addCoversheetInteractor } from '../../shared/src/proxies/documents/addCoversheetProxy';
import { addDeficiencyStatisticInteractor } from '../../shared/src/proxies/caseStatistics/addDeficiencyStatisticProxy';
import { addPaperFilingInteractor } from '../../shared/src/proxies/documents/addPaperFilingProxy';
import { addPetitionerToCaseInteractor } from '../../shared/src/proxies/addPetitionerToCaseProxy';
import { aggregatePartiesForService } from '../../shared/src/business/utilities/aggregatePartiesForService';
import { appendAmendedPetitionFormInteractor } from '../../shared/src/proxies/courtIssuedOrder/appendAmendedPetitionFormProxy';
import { archiveCorrespondenceDocumentInteractor } from '../../shared/src/proxies/correspondence/archiveCorrespondenceDocumentProxy';
import { archiveDraftDocumentInteractor } from '../../shared/src/proxies/archiveDraftDocumentProxy';
import { assignWorkItemsInteractor } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { associateIrsPractitionerWithCaseInteractor } from '../../shared/src/proxies/manualAssociation/associateIrsPractitionerWithCaseProxy';
import { associatePrivatePractitionerWithCaseInteractor } from '../../shared/src/proxies/manualAssociation/associatePrivatePractitionerWithCaseProxy';
import { batchDownloadTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/batchDownloadTrialSessionProxy';
import { blockCaseFromTrialInteractor } from '../../shared/src/proxies/blockCaseFromTrialProxy';
import { calculateDaysElapsedSinceLastStatusChange } from '../../shared/src/business/utilities/calculateDaysElapsedSinceLastStatusChange';
import {
  calculateDifferenceInDays,
  calculateISODate,
  checkDate,
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  getDateFormat,
  getMonthDayYearInETObj,
  isStringISOFormatted,
  isTodayWithinGivenInterval,
  isValidDateString,
  prepareDateFromString,
  validateDateAndCreateISO,
} from '../../shared/src/business/utilities/DateHandler';
import { canConsolidateInteractor } from '../../shared/src/business/useCases/caseConsolidation/canConsolidateInteractor';
import { canSetTrialSessionAsCalendaredInteractor } from '../../shared/src/business/useCases/trialSessions/canSetTrialSessionAsCalendaredInteractor';
import { caseAdvancedSearchInteractor } from '../../shared/src/proxies/caseAdvancedSearchProxy';
import { caseStatusWithTrialInformation } from '@shared/business/utilities/caseStatusWithTrialInformation';
import { changePasswordInteractor } from '@shared/proxies/auth/changePasswordProxy';
import { checkEmailAvailabilityInteractor } from '../../shared/src/proxies/users/checkEmailAvailabilityProxy';
import { closeTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/closeTrialSessionProxy';
import {
  compareCasesByDocketNumber,
  formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
} from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import {
  compareISODateStrings,
  compareStrings,
} from '../../shared/src/business/utilities/sortFunctions';
import { completeDocketEntryQCInteractor } from '../../shared/src/proxies/editDocketEntry/completeDocketEntryQCProxy';
import { completeMessageInteractor } from '../../shared/src/proxies/messages/completeMessageProxy';
import { completeWorkItemInteractor } from '../../shared/src/proxies/workitems/completeWorkItemProxy';
import { confirmSignUpInteractor } from '../../shared/src/proxies/auth/confirmSignUpProxy';
import { createCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/createCaseDeadlineProxy';
import { createCaseFromPaperInteractor } from '../../shared/src/proxies/createCaseFromPaperProxy';
import { createCaseInteractor } from '../../shared/src/proxies/createCaseProxy';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '../../shared/src/proxies/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlProxy';
import { createJudgeUserInteractor } from '../../shared/src/proxies/judges/createJudgeUserProxy';
import { createMessageInteractor } from '../../shared/src/proxies/messages/createMessageProxy';
import { createPractitionerDocumentInteractor } from '../../shared/src/proxies/practitioners/createPractitionerDocumentProxy';
import { createPractitionerUserInteractor } from '../../shared/src/proxies/practitioners/createPractitionerUserProxy';
import { createTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/createTrialSessionProxy';
import { deleteAuthCookieInteractor } from '../../shared/src/proxies/auth/deleteAuthCookieProxy';
import { deleteCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/deleteCaseDeadlineProxy';
import { deleteCaseNoteInteractor } from '../../shared/src/proxies/caseNote/deleteCaseNoteProxy';
import { deleteCounselFromCaseInteractor } from '../../shared/src/proxies/caseAssociation/deleteCounselFromCaseProxy';
import { deleteDeficiencyStatisticInteractor } from '../../shared/src/proxies/caseStatistics/deleteDeficiencyStatisticProxy';
import { deleteDocketEntryWorksheetInteractor } from '@shared/proxies/pendingMotion/deleteDocketEntryWorksheetProxy';
import { deletePractitionerDocumentInteractor } from '../../shared/src/proxies/practitioners/deletePractitionerDocumentProxy';
import { deleteTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/deleteTrialSessionProxy';
import { deleteUserCaseNoteInteractor } from '../../shared/src/proxies/caseNote/deleteUserCaseNoteProxy';
import { dismissNOTTReminderForTrialInteractor } from '../../shared/src/proxies/trialSessions/dismissNOTTReminderForTrialProxy';
import { downloadCsv } from '@web-client/presenter/utilities/downloadCsv';
import { editPaperFilingInteractor } from '../../shared/src/proxies/documents/editPaperFilingProxy';
import { editPractitionerDocumentInteractor } from '../../shared/src/proxies/practitioners/editPractitionerDocumentProxy';
import { exportPendingReportInteractor } from '@shared/proxies/pendingItems/exportPendingReportProxy';
import { fetchPendingItemsInteractor } from '../../shared/src/proxies/pendingItems/fetchPendingItemsProxy';
import { fileAndServeCourtIssuedDocumentInteractor } from '../../shared/src/proxies/documents/fileAndServeCourtIssuedDocumentProxy';
import { fileCorrespondenceDocumentInteractor } from '../../shared/src/proxies/correspondence/fileCorrespondenceDocumentProxy';
import { fileCourtIssuedDocketEntryInteractor } from '../../shared/src/proxies/documents/fileCourtIssuedDocketEntryProxy';
import { fileCourtIssuedOrderInteractor } from '../../shared/src/proxies/courtIssuedOrder/fileCourtIssuedOrderProxy';
import { fileExternalDocumentInteractor } from '../../shared/src/proxies/documents/fileExternalDocumentProxy';
import { filePetitionFromPaperInteractor } from '../../shared/src/business/useCases/filePetitionFromPaperInteractor';
import { filePetitionInteractor } from '../../shared/src/business/useCases/filePetitionInteractor';
import { filterEmptyStrings } from '../../shared/src/business/utilities/filterEmptyStrings';
import { forgotPasswordInteractor } from '@shared/proxies/auth/forgotPasswordProxy';
import { formatAttachments } from '../../shared/src/business/utilities/formatAttachments';
import {
  formatCase,
  formatDocketEntry,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketEntries,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { formatDollars } from '../../shared/src/business/utilities/formatDollars';
import {
  formatJudgeName,
  getJudgeLastName,
} from '../../shared/src/business/utilities/getFormattedJudgeName';
import { formatPendingItem } from '@shared/business/utilities/formatPendingItem';
import { formatPhoneNumber } from '../../shared/src/business/utilities/formatPhoneNumber';
import { forwardMessageInteractor } from '../../shared/src/proxies/messages/forwardMessageProxy';
import { generateCaseAssociationDocumentTitleInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/generateCaseAssociationDocumentTitleInteractor';
import { generateCourtIssuedDocumentTitle } from '../../shared/src/business/useCases/courtIssuedDocument/generateCourtIssuedDocumentTitle';
import { generateDocketRecordPdfInteractor } from '../../shared/src/proxies/generateDocketRecordPdfProxy';
import { generateDraftStampOrderInteractor } from '../../shared/src/proxies/documents/generateDraftStampOrderProxy';
import { generateEntryOfAppearancePdfInteractor } from '../../shared/src/proxies/caseAssociation/generateEntryOfAppearancePdfProxy';
import { generateExternalDocumentTitle } from '../../shared/src/business/useCases/externalDocument/generateExternalDocumentTitle';
import { generatePDFFromJPGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromJPGDataInteractor';
import { generatePractitionerCaseListPdfInteractor } from '../../shared/src/proxies/practitioners/generatePractitionerCaseListPdfProxy';
import { generatePrintableCaseInventoryReportInteractor } from '../../shared/src/proxies/reports/generatePrintableCaseInventoryReportProxy';
import { generatePrintableFilingReceiptInteractor } from '../../shared/src/proxies/generatePrintableFilingReceiptProxy';
import { generatePrintablePendingReportInteractor } from '../../shared/src/proxies/pendingItems/generatePrintablePendingReportProxy';
import { generatePrintableTrialSessionCopyReportInteractor } from '../../shared/src/proxies/trialSessions/generatePrintableTrialSessionCopyReportProxy';
import { generateSignedDocumentInteractor } from '../../shared/src/business/useCases/generateSignedDocumentInteractor';
import { generateTrialCalendarPdfInteractor } from '../../shared/src/proxies/trialSessions/generateTrialCalendarPdfProxy';
import { getAllFeatureFlagsInteractor } from '../../shared/src/proxies/featureFlag/getAllFeatureFlagsProxy';
import { getAllUsersByRoleInteractor } from '@shared/proxies/users/getAllUsersByRoleProxy';
import { getBlockedCasesInteractor } from '../../shared/src/proxies/reports/getBlockedCasesProxy';
import { getCalendaredCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getCalendaredCasesForTrialSessionProxy';
import { getCaseDeadlinesForCaseInteractor } from '../../shared/src/proxies/caseDeadline/getCaseDeadlinesForCaseProxy';
import { getCaseDeadlinesInteractor } from '../../shared/src/proxies/caseDeadline/getCaseDeadlinesProxy';
import { getCaseExistsInteractor } from '../../shared/src/proxies/getCaseExistsProxy';
import { getCaseInteractor } from '../../shared/src/proxies/getCaseProxy';
import { getCaseInventoryReportInteractor } from '../../shared/src/proxies/reports/getCaseInventoryReportProxy';
import { getCaseWorksheetsByJudgeInteractor } from '@shared/proxies/reports/getCaseWorksheetsByJudgeProxy';
import { getCasesClosedByJudgeInteractor } from '../../shared/src/proxies/reports/getCasesClosedByJudgeProxy';
import { getCasesForUserInteractor } from '../../shared/src/proxies/getCasesForUserProxy';
import {
  getChambersSections,
  getChambersSectionsLabels,
  getJudgesChambers,
} from './business/chambers/getJudgesChambers';
import { getClinicLetterKey } from '../../shared/src/business/utilities/getClinicLetterKey';
import { getCompletedMessagesForSectionInteractor } from '../../shared/src/proxies/messages/getCompletedMessagesForSectionProxy';
import { getCompletedMessagesForUserInteractor } from '../../shared/src/proxies/messages/getCompletedMessagesForUserProxy';
import { getConstants } from './getConstants';
import { getCountOfCaseDocumentsFiledByJudgesInteractor } from '@shared/proxies/reports/getCountOfCaseDocumentsFiledByJudgesProxy';
import { getCropBox } from '../../shared/src/business/utilities/getCropBox';
import { getCustomCaseReportInteractor } from '../../shared/src/proxies/reports/getCustomCaseReportProxy';
import { getDescriptionDisplay } from '../../shared/src/business/utilities/getDescriptionDisplay';
import {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} from '../../shared/src/business/utilities/getWorkQueueFilters';
import { getDocument } from '@web-client/persistence/s3/getDocument';
import { getDocumentContentsForDocketEntryInteractor } from '../../shared/src/proxies/documents/getDocumentContentsForDocketEntryProxy';
import { getDocumentDownloadUrlInteractor } from '../../shared/src/proxies/getDocumentDownloadUrlProxy';
import { getDocumentQCInboxForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { getDocumentQCInboxForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCInboxForUserProxy';
import { getDocumentQCServedForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCServedForSectionProxy';
import { getDocumentQCServedForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCServedForUserProxy';
import { getDocumentTitleWithAdditionalInfo } from '../../shared/src/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getEligibleCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getEligibleCasesForTrialSessionProxy';
import { getFormattedPartiesNameAndTitle } from '../../shared/src/business/utilities/getFormattedPartiesNameAndTitle';
import { getHealthCheckInteractor } from '../../shared/src/proxies/health/getHealthCheckProxy';
import { getHttpClient } from '@web-client/providers/httpClient';
import { getInboxMessagesForSectionInteractor } from '../../shared/src/proxies/messages/getInboxMessagesForSectionProxy';
import { getInboxMessagesForUserInteractor } from '../../shared/src/proxies/messages/getInboxMessagesForUserProxy';
import { getInternalUsersInteractor } from '../../shared/src/proxies/users/getInternalUsersProxy';
import { getIrsPractitionersBySearchKeyInteractor } from '../../shared/src/proxies/users/getIrsPractitionersBySearchKeyProxy';
import { getIsFeatureEnabled } from '../../shared/src/business/utilities/getIsFeatureEnabled';
import { getItem } from './persistence/localStorage/getItem';
import { getItemInteractor } from '../../shared/src/business/useCases/getItemInteractor';
import { getJudgeInSectionInteractor } from '../../shared/src/proxies/users/getJudgeInSectionProxy';
import { getMaintenanceModeInteractor } from '../../shared/src/proxies/maintenance/getMaintenanceModeProxy';
import { getMessageThreadInteractor } from '../../shared/src/proxies/messages/getMessageThreadProxy';
import { getMessagesForCaseInteractor } from '../../shared/src/proxies/messages/getMessagesForCaseProxy';
import { getNotificationsInteractor } from '../../shared/src/proxies/users/getNotificationsProxy';
import { getOutboxMessagesForSectionInteractor } from '../../shared/src/proxies/messages/getOutboxMessagesForSectionProxy';
import { getOutboxMessagesForUserInteractor } from '../../shared/src/proxies/messages/getOutboxMessagesForUserProxy';
import { getPaperServicePdfUrlInteractor } from '@shared/proxies/trialSessions/getPaperServicePdfUrlProxy';
import { getPdfFromUrl } from '@web-client/persistence/s3/getPdfFromUrl';
import { getPdfFromUrlInteractor } from '../../shared/src/business/useCases/document/getPdfFromUrlInteractor';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@shared/proxies/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeProxy';
import { getPractitionerByBarNumberInteractor } from '../../shared/src/proxies/users/getPractitionerByBarNumberProxy';
import { getPractitionerDocumentDownloadUrlInteractor } from '../../shared/src/proxies/getPractitionerDocumentDownloadUrlProxy';
import { getPractitionerDocumentInteractor } from '../../shared/src/proxies/getPractitionerDocumentProxy';
import { getPractitionerDocumentsInteractor } from '../../shared/src/proxies/practitioners/getPractitionerDocumentsProxy';
import { getPractitionersByNameInteractor } from '../../shared/src/proxies/practitioners/getPractitionersByNameProxy';
import { getPrivatePractitionersBySearchKeyInteractor } from '../../shared/src/proxies/users/getPrivatePractitionersBySearchKeyProxy';
import { getScannerInterface } from './persistence/dynamsoft/getScannerInterface';
import { getScannerMockInterface } from './persistence/dynamsoft/getScannerMockInterface';
import { getSealedDocketEntryTooltip } from '../../shared/src/business/utilities/getSealedDocketEntryTooltip';
import { getSelectedConsolidatedCasesToMultiDocketOn } from '@shared/business/utilities/getSelectedConsolidatedCasesToMultiDocketOn';
import { getStampBoxCoordinates } from '../../shared/src/business/utilities/getStampBoxCoordinates';
import { getStandaloneRemoteDocumentTitle } from '../../shared/src/business/utilities/getStandaloneRemoteDocumentTitle';
import { getStatusOfVirusScanInteractor } from '../../shared/src/proxies/documents/getStatusOfVirusScanProxy';
import { getTrialSessionDetailsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionDetailsProxy';
import { getTrialSessionWorkingCopyInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionWorkingCopyProxy';
import { getTrialSessionsForJudgeActivityReportInteractor } from '../../shared/src/proxies/reports/getTrialSessionsForJudgeActivityReportProxy';
import { getTrialSessionsForJudgeInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionsForJudgeProxy';
import { getTrialSessionsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionsProxy';
import { getUserByIdInteractor } from '../../shared/src/proxies/users/getUserByIdProxy';
import { getUserCaseNoteForCasesInteractor } from '../../shared/src/proxies/caseNote/getUserCaseNoteForCasesProxy';
import { getUserCaseNoteInteractor } from '../../shared/src/proxies/caseNote/getUserCaseNoteProxy';
import { getUserInteractor } from '../../shared/src/proxies/users/getUserProxy';
import { getUserPendingEmailInteractor } from '../../shared/src/proxies/users/getUserPendingEmailProxy';
import { getUserPendingEmailStatusInteractor } from '../../shared/src/proxies/users/getUserPendingEmailStatusProxy';
import { getUserPermissions } from '../../shared/src/authorization/getUserPermissions';
import { getUsersInSectionInteractor } from '../../shared/src/proxies/users/getUsersInSectionProxy';
import { getUsersPendingEmailInteractor } from '../../shared/src/proxies/users/getUsersPendingEmailProxy';
import { getWorkItemInteractor } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { loadPDFForPreviewInteractor } from '../../shared/src/business/useCases/loadPDFForPreviewInteractor';
import { loadPDFForSigningInteractor } from '../../shared/src/business/useCases/loadPDFForSigningInteractor';
import { loginInteractor } from '@shared/proxies/auth/loginProxy';
import { openUrlInNewTab } from './presenter/utilities/openUrlInNewTab';
import { opinionAdvancedSearchInteractor } from '../../shared/src/proxies/opinionAdvancedSearchProxy';
import { orderAdvancedSearchInteractor } from '../../shared/src/proxies/orderAdvancedSearchProxy';
import { prioritizeCaseInteractor } from '../../shared/src/proxies/prioritizeCaseProxy';
import { removeCaseFromTrialInteractor } from '../../shared/src/proxies/trialSessions/removeCaseFromTrialProxy';
import { removeCasePendingItemInteractor } from '../../shared/src/proxies/removeCasePendingItemProxy';
import { removeConsolidatedCasesInteractor } from '../../shared/src/proxies/removeConsolidatedCasesProxy';
import { removeItem } from './persistence/localStorage/removeItem';
import { removeItemInteractor } from '../../shared/src/business/useCases/removeItemInteractor';
import { removePdfFromDocketEntryInteractor } from '../../shared/src/proxies/documents/removePdfFromDocketEntryProxy';
import { removePetitionerAndUpdateCaptionInteractor } from '../../shared/src/proxies/removePetitionerAndUpdateCaptionProxy';
import { removeSignatureFromDocumentInteractor } from '../../shared/src/proxies/documents/removeSignatureFromDocumentProxy';
import { renewIdTokenInteractor } from '../../shared/src/proxies/auth/renewIdTokenProxy';
import { replaceBracketed } from '../../shared/src/business/utilities/replaceBracketed';
import { replyToMessageInteractor } from '../../shared/src/proxies/messages/replyToMessageProxy';
import { runTrialSessionPlanningReportInteractor } from '../../shared/src/proxies/trialSessions/runTrialSessionPlanningReportProxy';
import { saveCalendarNoteInteractor } from '../../shared/src/proxies/trialSessions/saveCalendarNoteProxy';
import { saveCaseDetailInternalEditInteractor } from '../../shared/src/proxies/saveCaseDetailInternalEditProxy';
import { saveCaseNoteInteractor } from '../../shared/src/proxies/caseNote/saveCaseNoteProxy';
import { saveSignedDocumentInteractor } from '../../shared/src/proxies/documents/saveSignedDocumentProxy';
import { sealCaseContactAddressInteractor } from '../../shared/src/proxies/sealCaseContactAddressProxy';
import { sealCaseInteractor } from '../../shared/src/proxies/sealCaseProxy';
import { sealDocketEntryInteractor } from '../../shared/src/proxies/editDocketEntry/sealDocketEntryProxy';
import { serveCaseToIrsInteractor } from '../../shared/src/proxies/serveCaseToIrs/serveCaseToIrsProxy';
import { serveCourtIssuedDocumentInteractor } from '../../shared/src/proxies/serveCourtIssuedDocumentProxy';
import { serveExternallyFiledDocumentInteractor } from '../../shared/src/proxies/documents/serveExternallyFiledDocumentProxy';
import { serveThirtyDayNoticeInteractor } from '../../shared/src/proxies/trialSessions/serveThirtyDayNoticeProxy';
import { setConsolidationFlagsForDisplay } from '../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { setDocumentTitleFromStampDataInteractor } from '../../shared/src/business/useCases/stampMotion/setDocumentTitleFromStampDataInteractor';
import { setForHearingInteractor } from '../../shared/src/proxies/trialSessions/setForHearingProxy';
import { setItem } from './persistence/localStorage/setItem';
import { setItemInteractor } from '../../shared/src/business/useCases/setItemInteractor';
import { setMessageAsReadInteractor } from '../../shared/src/proxies/messages/setMessageAsReadProxy';
import { setNoticesForCalendaredTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/setNoticesForCalendaredTrialSessionProxy';
import { setServiceIndicatorsForCase } from '../../shared/src/business/utilities/setServiceIndicatorsForCase';
import { setTrialSessionCalendarInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionCalendarProxy';
import { setWorkItemAsReadInteractor } from '../../shared/src/proxies/workitems/setWorkItemAsReadProxy';
import { setupPdfDocument } from '../../shared/src/business/utilities/setupPdfDocument';
import { signUpUserInteractor } from '../../shared/src/proxies/signUpUserProxy';
import { sleep } from '../../shared/src/business/utilities/sleep';
import { strikeDocketEntryInteractor } from '../../shared/src/proxies/editDocketEntry/strikeDocketEntryProxy';
import { submitCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitCaseAssociationRequestProxy';
import { submitPendingCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitPendingCaseAssociationRequestProxy';
import { transformFormValueToTitleCaseOrdinal } from '../../shared/src/business/utilities/transformFormValueToTitleCaseOrdinal';
import { tryCatchDecorator } from './tryCatchDecorator';
import { unblockCaseFromTrialInteractor } from '../../shared/src/proxies/unblockCaseFromTrialProxy';
import { unprioritizeCaseInteractor } from '../../shared/src/proxies/unprioritizeCaseProxy';
import { unsealCaseInteractor } from '../../shared/src/proxies/unsealCaseProxy';
import { unsealDocketEntryInteractor } from '../../shared/src/proxies/editDocketEntry/unsealDocketEntryProxy';
import { updateCaseContextInteractor } from '../../shared/src/proxies/updateCaseContextProxy';
import { updateCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/updateCaseDeadlineProxy';
import { updateCaseDetailsInteractor } from '../../shared/src/proxies/updateCaseDetailsProxy';
import { updateCaseTrialSortTagsInteractor } from '../../shared/src/proxies/updateCaseTrialSortTagsProxy';
import { updateCaseWorksheetInteractor } from '@shared/proxies/caseWorksheet/updateCaseWorksheetProxy';
import { updateContactInteractor } from '../../shared/src/proxies/updateContactProxy';
import { updateCorrespondenceDocumentInteractor } from '../../shared/src/proxies/correspondence/updateCorrespondenceDocumentProxy';
import { updateCounselOnCaseInteractor } from '../../shared/src/proxies/caseAssociation/updateCounselOnCaseProxy';
import { updateCourtIssuedDocketEntryInteractor } from '../../shared/src/proxies/documents/updateCourtIssuedDocketEntryProxy';
import { updateCourtIssuedOrderInteractor } from '../../shared/src/proxies/courtIssuedOrder/updateCourtIssuedOrderProxy';
import { updateDeficiencyStatisticInteractor } from '../../shared/src/proxies/caseStatistics/updateDeficiencyStatisticProxy';
import { updateDocketEntryMetaInteractor } from '../../shared/src/proxies/documents/updateDocketEntryMetaProxy';
import { updateDocketEntryWorksheetInteractor } from '@shared/proxies/pendingItems/updateDocketEntryWorksheetProxy';
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
import { uploadDocumentFromClient } from '@web-client/persistence/s3/uploadDocumentFromClient';
import { uploadDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadDocumentInteractor';
import { uploadExternalDocumentsInteractor } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentsInteractor';
import { uploadOrderDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadOrderDocumentInteractor';
import { uploadPdfFromClient } from '@web-client/persistence/s3/uploadPdfFromClient';
import { validateAddDeficiencyStatisticsInteractor } from '../../shared/src/business/useCases/validateAddDeficiencyStatisticsInteractor';
import { validateAddIrsPractitionerInteractor } from '../../shared/src/business/useCases/caseAssociation/validateAddIrsPractitionerInteractor';
import { validateAddPetitionerInteractor } from '../../shared/src/business/useCases/validateAddPetitionerInteractor';
import { validateAddPractitionerDocumentFormInteractor } from '../../shared/src/business/useCases/practitioners/validateAddPractitionerDocumentFormInteractor';
import { validateAddPractitionerInteractor } from '../../shared/src/business/useCases/practitioners/validateAddPractitionerInteractor';
import { validateAddPrivatePractitionerInteractor } from '../../shared/src/business/useCases/caseAssociation/validateAddPrivatePractitionerInteractor';
import { validateCalendarNoteInteractor } from '../../shared/src/business/useCases/validateCalendarNoteInteractor';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import { validateCaseAssociationRequestInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/validateCaseAssociationRequestInteractor';
import { validateCaseDeadlineInteractor } from '../../shared/src/business/useCases/caseDeadline/validateCaseDeadlineInteractor';
import { validateCaseDetailInteractor } from '../../shared/src/business/useCases/validateCaseDetailInteractor';
import { validateCaseWorksheetInteractor } from '@shared/business/useCases/caseWorksheet/validateCaseWorksheetInteractor';
import { validateCourtIssuedDocketEntryInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/validateCourtIssuedDocketEntryInteractor';
import { validateCreateMessageInteractor } from '../../shared/src/business/useCases/messages/validateCreateMessageInteractor';
import { validateDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/validateDocketEntryInteractor';
import { validateDocketEntryWorksheetInteractor } from '@shared/business/useCases/pendingMotion/validateDocketEntryWorksheetInteractor';
import { validateDocumentInteractor } from '../../shared/src/business/useCases/validateDocumentInteractor';
import { validateEditPetitionerCounselInteractor } from '../../shared/src/business/useCases/caseAssociation/validateEditPetitionerCounselInteractor';
import { validateExternalDocumentInformationInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInformationInteractor';
import { validateExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInteractor';
import { validateHearingNoteInteractor } from '../../shared/src/business/useCases/validateHearingNoteInteractor';
import { validateNoteInteractor } from '../../shared/src/business/useCases/caseNote/validateNoteInteractor';
import { validateOpinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOpinionAdvancedSearchInteractor';
import { validateOrderAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOrderAdvancedSearchInteractor';
import { validateOrderWithoutBodyInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/validateOrderWithoutBodyInteractor';
import { validatePdfInteractor } from '../../shared/src/proxies/documents/validatePdfProxy';
import { validatePenaltiesInteractor } from '../../shared/src/business/useCases/validatePenaltiesInteractor';
import { validatePetitionFromPaperInteractor } from '../../shared/src/business/useCases/validatePetitionFromPaperInteractor';
import { validatePetitionInteractor } from '../../shared/src/business/useCases/validatePetitionInteractor';
import { validatePetitionerInformationFormInteractor } from '../../shared/src/business/useCases/validatePetitionerInformationFormInteractor';
import { validatePetitionerInteractor } from '../../shared/src/business/useCases/validatePetitionerInteractor';
import { validatePractitionerInteractor } from '../../shared/src/business/useCases/practitioners/validatePractitionerInteractor';
import { validateSearchDeadlinesInteractor } from '../../shared/src/business/useCases/validateSearchDeadlinesInteractor';
import { validateStampInteractor } from '../../shared/src/business/useCases/stampMotion/validateStampInteractor';
import { validateStartCaseWizardInteractor } from '../../shared/src/business/useCases/startCase/validateStartCaseWizardInteractor';
import { validateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/validateTrialSessionInteractor';
import { validateUpdateUserEmailInteractor } from '../../shared/src/business/useCases/validateUpdateUserEmailInteractor';
import { validateUserContactInteractor } from '../../shared/src/business/useCases/users/validateUserContactInteractor';
import { verifyPendingCaseForUserInteractor } from '../../shared/src/proxies/verifyPendingCaseForUserProxy';
import { verifyUserPendingEmailInteractor } from '../../shared/src/proxies/users/verifyUserPendingEmailProxy';
import ImageBlobReduce from 'image-blob-reduce';
import deepFreeze from 'deep-freeze';

const reduce = ImageBlobReduce({
  pica: ImageBlobReduce.pica({ features: ['js'] }),
});

let user;
let broadcastChannel;

const getCurrentUser = (): RawUser | RawPractitioner | RawIrsPractitioner => {
  return user;
};
const setCurrentUser = (
  newUser: RawUser | RawPractitioner | RawIrsPractitioner,
) => {
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
  appendAmendedPetitionFormInteractor,
  archiveCorrespondenceDocumentInteractor,
  archiveDraftDocumentInteractor,
  assignWorkItemsInteractor,
  associateIrsPractitionerWithCaseInteractor,
  associatePrivatePractitionerWithCaseInteractor,
  batchDownloadTrialSessionInteractor,
  blockCaseFromTrialInteractor,
  canConsolidateInteractor,
  canSetTrialSessionAsCalendaredInteractor,
  caseAdvancedSearchInteractor,
  changePasswordInteractor,
  checkEmailAvailabilityInteractor,
  closeTrialSessionInteractor,
  completeDocketEntryQCInteractor,
  completeMessageInteractor,
  completeWorkItemInteractor,
  confirmSignUpInteractor,
  createCaseDeadlineInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createJudgeUserInteractor,
  createMessageInteractor,
  createPractitionerDocumentInteractor,
  createPractitionerUserInteractor,
  createTrialSessionInteractor,
  deleteAuthCookieInteractor,
  deleteCaseDeadlineInteractor,
  deleteCaseNoteInteractor,
  deleteCounselFromCaseInteractor,
  deleteDeficiencyStatisticInteractor,
  deleteDocketEntryWorksheetInteractor,
  deletePractitionerDocumentInteractor,
  deleteTrialSessionInteractor,
  deleteUserCaseNoteInteractor,
  dismissNOTTReminderForTrialInteractor,
  editPaperFilingInteractor,
  editPractitionerDocumentInteractor,
  exportPendingReportInteractor,
  fetchPendingItemsInteractor,
  fileAndServeCourtIssuedDocumentInteractor,
  fileCorrespondenceDocumentInteractor,
  fileCourtIssuedDocketEntryInteractor,
  fileCourtIssuedOrderInteractor,
  fileExternalDocumentInteractor,
  filePetitionFromPaperInteractor,
  filePetitionInteractor,
  forgotPasswordInteractor,
  forwardMessageInteractor,
  generateCaseAssociationDocumentTitleInteractor,
  generateDocketRecordPdfInteractor,
  generateDraftStampOrderInteractor,
  generateEntryOfAppearancePdfInteractor,
  generatePDFFromJPGDataInteractor,
  generatePractitionerCaseListPdfInteractor,
  generatePrintableCaseInventoryReportInteractor,
  generatePrintableFilingReceiptInteractor,
  generatePrintablePendingReportInteractor,
  generatePrintableTrialSessionCopyReportInteractor,
  generateSignedDocumentInteractor,
  generateTrialCalendarPdfInteractor,
  getAllFeatureFlagsInteractor,
  getAllUsersByRoleInteractor,
  getBlockedCasesInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseDeadlinesForCaseInteractor,
  getCaseDeadlinesInteractor,
  getCaseExistsInteractor,
  getCaseInteractor,
  getCaseInventoryReportInteractor,
  getCaseWorksheetsByJudgeInteractor,
  getCasesClosedByJudgeInteractor,
  getCasesForUserInteractor,
  getCompletedMessagesForSectionInteractor,
  getCompletedMessagesForUserInteractor,
  getCountOfCaseDocumentsFiledByJudgesInteractor,
  getCustomCaseReportInteractor,
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
  getJudgeInSectionInteractor,
  getMaintenanceModeInteractor,
  getMessageThreadInteractor,
  getMessagesForCaseInteractor,
  getNotificationsInteractor,
  getOutboxMessagesForSectionInteractor,
  getOutboxMessagesForUserInteractor,
  getPaperServicePdfUrlInteractor,
  getPdfFromUrlInteractor,
  getPendingMotionDocketEntriesForCurrentJudgeInteractor,
  getPractitionerByBarNumberInteractor,
  getPractitionerDocumentDownloadUrlInteractor,
  getPractitionerDocumentInteractor,
  getPractitionerDocumentsInteractor,
  getPractitionersByNameInteractor,
  getPrivatePractitionersBySearchKeyInteractor,
  getStatusOfVirusScanInteractor: (applicationContext, args) =>
    process.env.SKIP_VIRUS_SCAN
      ? null
      : getStatusOfVirusScanInteractor(applicationContext, args),
  getTrialSessionDetailsInteractor,
  getTrialSessionWorkingCopyInteractor,
  getTrialSessionsForJudgeActivityReportInteractor,
  getTrialSessionsForJudgeInteractor,
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
  loginInteractor,
  opinionAdvancedSearchInteractor,
  orderAdvancedSearchInteractor,
  prioritizeCaseInteractor,
  removeCaseFromTrialInteractor,
  removeCasePendingItemInteractor,
  removeConsolidatedCasesInteractor,
  removeItemInteractor,
  removePdfFromDocketEntryInteractor,
  removePetitionerAndUpdateCaptionInteractor,
  removeSignatureFromDocumentInteractor,
  renewIdTokenInteractor,
  replyToMessageInteractor,
  runTrialSessionPlanningReportInteractor,
  saveCalendarNoteInteractor,
  saveCaseDetailInternalEditInteractor,
  saveCaseNoteInteractor,
  saveSignedDocumentInteractor,
  sealCaseContactAddressInteractor,
  sealCaseInteractor,
  sealDocketEntryInteractor,
  serveCaseToIrsInteractor,
  serveCourtIssuedDocumentInteractor,
  serveExternallyFiledDocumentInteractor,
  serveThirtyDayNoticeInteractor,
  setDocumentTitleFromStampDataInteractor,
  setForHearingInteractor,
  setItemInteractor,
  setMessageAsReadInteractor,
  setNoticesForCalendaredTrialSessionInteractor,
  setTrialSessionCalendarInteractor,
  setWorkItemAsReadInteractor,
  signUpUserInteractor,
  strikeDocketEntryInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  unblockCaseFromTrialInteractor,
  unprioritizeCaseInteractor,
  unsealCaseInteractor,
  unsealDocketEntryInteractor,
  updateCaseContextInteractor,
  updateCaseDeadlineInteractor,
  updateCaseDetailsInteractor,
  updateCaseTrialSortTagsInteractor,
  updateCaseWorksheetInteractor,
  updateContactInteractor,
  updateCorrespondenceDocumentInteractor,
  updateCounselOnCaseInteractor,
  updateCourtIssuedDocketEntryInteractor,
  updateCourtIssuedOrderInteractor,
  updateDeficiencyStatisticInteractor,
  updateDocketEntryMetaInteractor,
  updateDocketEntryWorksheetInteractor,
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
  validateAddPractitionerDocumentFormInteractor,
  validateAddPractitionerInteractor,
  validateAddPrivatePractitionerInteractor,
  validateCalendarNoteInteractor,
  validateCaseAdvancedSearchInteractor,
  validateCaseAssociationRequestInteractor,
  validateCaseDeadlineInteractor,
  validateCaseDetailInteractor,
  validateCaseWorksheetInteractor,
  validateCourtIssuedDocketEntryInteractor,
  validateCreateMessageInteractor,
  validateDocketEntryInteractor,
  validateDocketEntryWorksheetInteractor,
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
  validatePenaltiesInteractor,
  validatePetitionFromPaperInteractor,
  validatePetitionInteractor,
  validatePetitionerInformationFormInteractor,
  validatePetitionerInteractor,
  validatePractitionerInteractor,
  validateSearchDeadlinesInteractor,
  validateStampInteractor,
  validateStartCaseWizardInteractor,
  validateTrialSessionInteractor,
  validateUpdateUserEmailInteractor,
  validateUserContactInteractor,
  verifyPendingCaseForUserInteractor,
  verifyUserPendingEmailInteractor,
};
tryCatchDecorator(allUseCases);

const appConstants = deepFreeze({
  ...getConstants(),
  ERROR_MAP_429,
}) as ReturnType<typeof getConstants>;

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
  getCognitoPasswordChangeUrl: () => {
    return process.env.COGNITO_PASSWORD_CHANGE_URL || 'noop';
  },
  getCognitoResetPasswordUrl: () => {
    return process.env.COGNITO_PASSWORD_RESET_REQUEST_URL || 'noop';
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
  getHttpClient,
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
    const pdfjsLib = (await import('pdfjs-dist')).default;
    const pdfjsWorker = (await import('pdfjs-dist/build/pdf.worker.entry'))
      .default;
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
  getScanner: () => {
    if (process.env.NO_SCANNER) {
      return getScannerMockInterface();
    } else {
      return getScannerInterface();
    }
  },
  getScannerResourceUri: () => {
    return (
      process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
    );
  },
  getTrialSessionsForJudgeInteractor,
  getUniqueId,
  getUseCases: () => allUseCases,
  getUserPermissions,
  getUtilities: () => {
    return {
      abbreviateState,
      aggregatePartiesForService,
      calculateDaysElapsedSinceLastStatusChange,
      calculateDifferenceInDays,
      calculateISODate,
      canAllowDocumentServiceForCase,
      caseHasServedDocketEntries,
      caseHasServedPetition,
      caseStatusWithTrialInformation,
      checkDate,
      compareCasesByDocketNumber,
      compareISODateStrings,
      compareStrings,
      createEndOfDayISO,
      createISODateString,
      createStartOfDayISO,
      dateStringsCompared,
      deconstructDate,
      downloadCsv,
      filterEmptyStrings,
      formatAttachments,
      formatCase,
      formatCaseForTrialSession,
      formatDateString,
      formatDocketEntry,
      formatDollars,
      formatJudgeName,
      formatNow,
      formatPendingItem,
      formatPhoneNumber,
      generateCourtIssuedDocumentTitle,
      generateExternalDocumentTitle,
      getAttachmentDocumentById: Case.getAttachmentDocumentById,
      getCaseCaption: Case.getCaseCaption,
      getClinicLetterKey,
      getContactPrimary,
      getContactSecondary,
      getCropBox,
      getDateFormat,
      getDescriptionDisplay,
      getDocQcSectionForUser,
      getDocumentTitleWithAdditionalInfo,
      getFilingsAndProceedings,
      getFormattedCaseDetail,
      getFormattedPartiesNameAndTitle,
      getFormattedTrialSessionDetails,
      getJudgeLastName,
      getJudgesChambers,
      getMonthDayYearInETObj,
      getOtherFilers,
      getPetitionDocketEntry,
      getPetitionerById,
      getPractitionersRepresenting,
      getSealedDocketEntryTooltip,
      getSelectedConsolidatedCasesToMultiDocketOn,
      getServedPartiesCode,
      getSortableDocketNumber: Case.getSortableDocketNumber,
      getStampBoxCoordinates,
      getStandaloneRemoteDocumentTitle,
      getWorkQueueFilters,
      hasPartyWithServiceType,
      isClosed,
      isCourtIssued: DocketEntry.isCourtIssued,
      isExternalUser: User.isExternalUser,
      isInternalUser: User.isInternalUser,
      isLeadCase,
      isPending: DocketEntry.isPending,
      isPendingOnCreation: DocketEntry.isPendingOnCreation,
      isSealedCase,
      isStringISOFormatted,
      isTodayWithinGivenInterval,
      isUserPartOfGroup,
      isValidDateString,
      openUrlInNewTab,
      prepareDateFromString,
      replaceBracketed,
      setConsolidationFlagsForDisplay,
      setServiceIndicatorsForCase,
      setupPdfDocument,
      sleep,
      sortDocketEntries,
      transformFormValueToTitleCaseOrdinal,
      userIsDirectlyAssociated,
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

export type ClientApplicationContext = typeof applicationContext;

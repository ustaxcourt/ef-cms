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
  ERROR_429,
  getEnvironment,
  getPublicSiteUrl,
  getUniqueId,
} from '../../shared/src/sharedAppContext';
import { User } from '../../shared/src/business/entities/User';
import { abbreviateState } from '../../shared/src/business/utilities/abbreviateState';
import { addCaseToTrialSessionInteractor } from '@web-client/proxies/trialSessions/addCaseToTrialSessionProxy';
import { addConsolidatedCaseInteractor } from '@web-client/proxies/addConsolidatedCaseProxy';
import { getDocketEntryProcessingStatusInteractor } from '@web-client/proxies/documents/getDocketEntryProcessingStatusProxy';
import { addDeficiencyStatisticInteractor } from '@web-client/proxies/caseStatistics/addDeficiencyStatisticProxy';
import { addPaperFilingInteractor } from '@web-client/proxies/documents/addPaperFilingProxy';
import { addPetitionerToCaseInteractor } from '@web-client/proxies/addPetitionerToCaseProxy';
import { aggregatePartiesForService } from '../../shared/src/business/utilities/aggregatePartiesForService';
import { appendAmendedPetitionFormInteractor } from '@web-client/proxies/courtIssuedOrder/appendAmendedPetitionFormProxy';
import { archiveCorrespondenceDocumentInteractor } from '@web-client/proxies/correspondence/archiveCorrespondenceDocumentProxy';
import { archiveDraftDocumentInteractor } from '@web-client/proxies/archiveDraftDocumentProxy';
import { assignWorkItemsInteractor } from '@web-client/proxies/workitems/assignWorkItemsProxy';
import { associateIrsPractitionerWithCaseInteractor } from '@web-client/proxies/manualAssociation/associateIrsPractitionerWithCaseProxy';
import { associatePrivatePractitionerWithCaseInteractor } from '@web-client/proxies/manualAssociation/associatePrivatePractitionerWithCaseProxy';
import { batchDownloadDocketEntriesInteractor } from '@web-client/proxies/documents/batchDownloadDocketEntriesProxy';
import { batchDownloadTrialSessionInteractor } from '@web-client/proxies/trialSessions/batchDownloadTrialSessionProxy';
import { blockCaseFromTrialInteractor } from '@web-client/proxies/blockCaseFromTrialProxy';
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
  isDateWithinGivenInterval,
  isStringISOFormatted,
  isValidDateString,
  isValidPastDate,
  prepareDateFromString,
  validateDateAndCreateISO,
} from '../../shared/src/business/utilities/DateHandler';
import { canConsolidateInteractor } from '../../shared/src/business/useCases/caseConsolidation/canConsolidateInteractor';
import { canSetTrialSessionAsCalendaredInteractor } from '../../shared/src/business/useCases/trialSessions/canSetTrialSessionAsCalendaredInteractor';
import { caseAdvancedSearchInteractor } from '@web-client/proxies/caseAdvancedSearchProxy';
import { caseStatusWithTrialInformation } from '@shared/business/utilities/caseStatusWithTrialInformation';
import { changePasswordInteractor } from '@web-client/proxies/auth/changePasswordProxy';
import { checkEmailAvailabilityInteractor } from '@web-client/proxies/users/checkEmailAvailabilityProxy';
import { closeTrialSessionInteractor } from '@web-client/proxies/trialSessions/closeTrialSessionProxy';
import {
  compareCasesByDocketNumber,
  formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
} from '../../shared/src/business/utilities/trialSession/getFormattedTrialSessionDetails';
import {
  compareISODateStrings,
  compareStrings,
} from '../../shared/src/business/utilities/sortFunctions';
import { completeDocketEntryQCInteractor } from '@web-client/proxies/editDocketEntry/completeDocketEntryQCProxy';
import { completeMessageInteractor } from '@web-client/proxies/messages/completeMessageProxy';
import { completeWorkItemInteractor } from '@web-client/proxies/workitems/completeWorkItemProxy';
import { confirmSignUpInteractor } from '@web-client/proxies/auth/confirmSignUpProxy';
import { createCaseDeadlineInteractor } from '@web-client/proxies/caseDeadline/createCaseDeadlineProxy';
import { createCaseFromPaperInteractor } from '@web-client/proxies/createCaseFromPaperProxy';
import { createCaseInteractor } from '@web-client/proxies/createCaseProxy';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '@web-client/proxies/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlProxy';
import { createMessageInteractor } from '@web-client/proxies/messages/createMessageProxy';
import { createPractitionerDocumentInteractor } from '@web-client/proxies/practitioners/createPractitionerDocumentProxy';
import { createPractitionerUserInteractor } from '@web-client/proxies/practitioners/createPractitionerUserProxy';
import { createTrialSessionInteractor } from '@web-client/proxies/trialSessions/createTrialSessionProxy';
import { deleteAuthCookieInteractor } from '@web-client/proxies/auth/deleteAuthCookieProxy';
import { deleteCaseDeadlineInteractor } from '@web-client/proxies/caseDeadline/deleteCaseDeadlineProxy';
import { deleteCaseNoteInteractor } from '@web-client/proxies/caseNote/deleteCaseNoteProxy';
import { deleteCounselFromCaseInteractor } from '@web-client/proxies/caseAssociation/deleteCounselFromCaseProxy';
import { deleteDeficiencyStatisticInteractor } from '@web-client/proxies/caseStatistics/deleteDeficiencyStatisticProxy';
import { deleteDocketEntryWorksheetInteractor } from '@web-client/proxies/pendingMotion/deleteDocketEntryWorksheetProxy';
import { deletePractitionerDocumentInteractor } from '@web-client/proxies/practitioners/deletePractitionerDocumentProxy';
import { deleteTrialSessionInteractor } from '@web-client/proxies/trialSessions/deleteTrialSessionProxy';
import { deleteUserCaseNoteInteractor } from '@web-client/proxies/caseNote/deleteUserCaseNoteProxy';
import { dismissNOTTReminderForTrialInteractor } from '@web-client/proxies/trialSessions/dismissNOTTReminderForTrialProxy';
import { downloadCsv } from '@web-client/presenter/utilities/downloadCsv';
import { downloadXlsx } from '@web-client/presenter/utilities/downloadXlsx';
import { editPaperFilingInteractor } from '@web-client/proxies/documents/editPaperFilingProxy';
import { editPractitionerDocumentInteractor } from '@web-client/proxies/practitioners/editPractitionerDocumentProxy';
import { exportPendingReportInteractor } from '@web-client/proxies/pendingItems/exportPendingReportProxy';
import { fetchPendingItemsInteractor } from '@web-client/proxies/pendingItems/fetchPendingItemsProxy';
import { fileAndServeCourtIssuedDocumentInteractor } from '@web-client/proxies/documents/fileAndServeCourtIssuedDocumentProxy';
import { fileCorrespondenceDocumentInteractor } from '@web-client/proxies/correspondence/fileCorrespondenceDocumentProxy';
import { fileCourtIssuedDocketEntryInteractor } from '@web-client/proxies/documents/fileCourtIssuedDocketEntryProxy';
import { fileCourtIssuedOrderInteractor } from '@web-client/proxies/courtIssuedOrder/fileCourtIssuedOrderProxy';
import { fileExternalDocumentInteractor } from '@web-client/proxies/documents/fileExternalDocumentProxy';
import { filterEmptyStrings } from '@web-client/business/utilities/filterEmptyStrings';
import { forgotPasswordInteractor } from '@web-client/proxies/auth/forgotPasswordProxy';
import { formatAttachments } from '@web-client/business/utilities/formatAttachments';
import {
  formatCase,
  formatDocketEntry,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketEntries,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { formatDollars } from '@web-client/business/utilities/formatDollars';
import {
  formatJudgeName,
  getJudgeLastName,
} from '../../shared/src/business/utilities/getFormattedJudgeName';
import { formatPendingItem } from '@shared/business/utilities/formatPendingItem';
import { formatPhoneNumber } from '../../shared/src/business/utilities/formatPhoneNumber';
import { forwardMessageInteractor } from '@web-client/proxies/messages/forwardMessageProxy';
import { generateCaseAssociationDocumentTitleInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/generateCaseAssociationDocumentTitleInteractor';
import { generateCourtIssuedDocumentTitle } from '../../shared/src/business/useCases/courtIssuedDocument/generateCourtIssuedDocumentTitle';
import { generateDocketRecordPdfInteractor } from '@web-client/proxies/generateDocketRecordPdfProxy';
import { generateDocumentIds } from '../../shared/src/business/useCases/generateDocumentIds';
import { generateDraftStampOrderInteractor } from '@web-client/proxies/documents/generateDraftStampOrderProxy';
import { generateEntryOfAppearancePdfInteractor } from '@web-client/proxies/caseAssociation/generateEntryOfAppearancePdfProxy';
import { generateExternalDocumentTitle } from '@web-client/business/useCases/externalDocument/generateExternalDocumentTitle';
import { generateNoticeOfWithdrawalPdfInteractor } from '@web-client/proxies/documents/generateNoticeOfWithdrawalPdfProxy';
import { generatePDFFromJPGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromJPGDataInteractor';
import { generatePetitionPdfInteractor } from '@web-client/proxies/generatePetitionPdfProxy';
import { generatePractitionerCaseListPdfInteractor } from '@web-client/proxies/practitioners/generatePractitionerCaseListPdfProxy';
import { generatePrintableCaseInventoryReportInteractor } from '@web-client/proxies/reports/generatePrintableCaseInventoryReportProxy';
import { generatePrintableFilingReceiptInteractor } from '@web-client/proxies/generatePrintableFilingReceiptProxy';
import { generatePrintablePendingReportInteractor } from '@web-client/proxies/pendingItems/generatePrintablePendingReportProxy';
import { generatePrintableTrialSessionCopyReportInteractor } from '@web-client/proxies/trialSessions/generatePrintableTrialSessionCopyReportProxy';
import { generateSignedDocumentInteractor } from '../../shared/src/business/useCases/generateSignedDocumentInteractor';
import { generateSuggestedTrialSessionCalendarInteractor } from '@web-client/proxies/trialSessions/generateSuggestedTrialSessionCalendarProxy';
import { generateTrialCalendarPdfInteractor } from '@web-client/proxies/trialSessions/generateTrialCalendarPdfProxy';
import { getAllFeatureFlagsInteractor } from '@web-client/proxies/featureFlag/getAllFeatureFlagsProxy';
import { getAllUsersByRoleInteractor } from '@web-client/proxies/users/getAllUsersByRoleProxy';
import { getBlockedCasesInteractor } from '@web-client/proxies/reports/getBlockedCasesProxy';
import { getBulkSpecialTrialSessionCopyNotesInteractor } from '@web-client/proxies/trialSessions/getBulkSpecialTrialSessionCopyNotesProxy';
import { getCalendaredCasesForTrialSessionInteractor } from '@web-client/proxies/trialSessions/getCalendaredCasesForTrialSessionProxy';
import { getCaseDeadlinesForCaseInteractor } from '@web-client/proxies/caseDeadline/getCaseDeadlinesForCaseProxy';
import { getCaseDeadlinesInteractor } from '@web-client/proxies/caseDeadline/getCaseDeadlinesProxy';
import { getCaseDocketEntriesInteractor } from '@web-client/proxies/getCaseDocketEntriesProxy';
import { getCaseDocumentsIdsFilteredByDocumentType } from '@shared/business/utilities/getCaseDocumentsIdsFilteredByDocumentType';
import { getCaseExistsInteractor } from '@web-client/proxies/getCaseExistsProxy';
import { getCaseInteractor } from '@web-client/proxies/getCaseProxy';
import { getCaseInventoryReportInteractor } from '@web-client/proxies/reports/getCaseInventoryReportProxy';
import { getCaseWorksheetsByJudgeInteractor } from '@web-client/proxies/reports/getCaseWorksheetsByJudgeProxy';
import { getCasesClosedByJudgeInteractor } from '@web-client/proxies/reports/getCasesClosedByJudgeProxy';
import { getCasesForUserInteractor } from '@web-client/proxies/getCasesForUserProxy';
import { getClerkDashboardStatsInteractor } from '@web-client/proxies/reports/getClerkDashboardStatsProxy';
import { getClinicLetterKey } from '@web-api/business/utilities/getClinicLetterKey';
import { getColdCaseReportInteractor } from '@web-client/proxies/reports/getColdCaseReportProxy';
import { getCompletedMessagesForSectionInteractor } from '@web-client/proxies/messages/getCompletedMessagesForSectionProxy';
import { getCompletedMessagesForUserInteractor } from '@web-client/proxies/messages/getCompletedMessagesForUserProxy';
import { getConstants } from './getConstants';
import { getCountOfCaseDocumentsFiledByJudgesInteractor } from '@web-client/proxies/reports/getCountOfCaseDocumentsFiledByJudgesProxy';
import { getCropBox } from '../../shared/src/business/utilities/getCropBox';
import { getDescriptionDisplay } from '../../shared/src/business/utilities/getDescriptionDisplay';
import { getDocketEntriesByFilter } from '@shared/business/utilities/getDocketEntriesByFilter';
import { getDocument } from '@web-client/persistence/s3/getDocument';
import { getDocumentContentsForDocketEntryInteractor } from '@web-client/proxies/documents/getDocumentContentsForDocketEntryProxy';
import { getDocumentDownloadUrlInteractor } from '@web-client/proxies/getDocumentDownloadUrlProxy';
import { getDocumentTitleWithAdditionalInfo } from '../../shared/src/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getEligibleCasesForTrialSessionInteractor } from '@web-client/proxies/trialSessions/getEligibleCasesForTrialSessionProxy';
import { getFormattedPartiesNameAndTitle } from '@web-client/business/utilities/getFormattedPartiesNameAndTitle';
import { getHealthCheckInteractor } from '@web-client/proxies/health/getHealthCheckProxy';
import { getHttpClient } from '@web-client/providers/httpClient';
import { getInboxMessagesForSectionInteractor } from '@web-client/proxies/messages/getInboxMessagesForSectionProxy';
import { getInboxMessagesForUserInteractor } from '@web-client/proxies/messages/getInboxMessagesForUserProxy';
import { getIrsPractitionersBySearchKeyInteractor } from '@web-client/proxies/users/getIrsPractitionersBySearchKeyProxy';
import { getIsFeatureEnabled } from '../../shared/src/business/utilities/getIsFeatureEnabled';
import { getItem } from './persistence/localStorage/getItem';
import { getItemInteractor } from '../../shared/src/business/useCases/getItemInteractor';
import { getJudgeInSectionInteractor } from '@web-client/proxies/users/getJudgeInSectionProxy';
import { getMaintenanceModeInteractor } from '@web-client/proxies/maintenance/getMaintenanceModeProxy';
import { getMessageThreadInteractor } from '@web-client/proxies/messages/getMessageThreadProxy';
import { getMessagesForCaseInteractor } from '@web-client/proxies/messages/getMessagesForCaseProxy';
import { getNotificationsInteractor } from '@web-client/proxies/users/getNotificationsProxy';
import { getOutboxMessagesForSectionInteractor } from '@web-client/proxies/messages/getOutboxMessagesForSectionProxy';
import { getOutboxMessagesForUserInteractor } from '@web-client/proxies/messages/getOutboxMessagesForUserProxy';
import { getPaperServicePdfUrlInteractor } from '@web-client/proxies/trialSessions/getPaperServicePdfUrlProxy';
import { getPdfFromUrl } from '@web-client/persistence/s3/getPdfFromUrl';
import { getPdfFromUrlInteractor } from '../../shared/src/business/useCases/document/getPdfFromUrlInteractor';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@web-client/proxies/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeProxy';
import { getPractitionerByBarNumberInteractor } from '@web-client/proxies/users/getPractitionerByBarNumberProxy';
import { getPractitionerCasesInteractor } from '@web-client/proxies/practitioners/getPractitionerCasesProxy';
import { getPractitionerDocumentDownloadUrlInteractor } from '@web-client/proxies/getPractitionerDocumentDownloadUrlProxy';
import { getPractitionerDocumentInteractor } from '@web-client/proxies/getPractitionerDocumentProxy';
import { getPractitionerDocumentsInteractor } from '@web-client/proxies/practitioners/getPractitionerDocumentsProxy';
import { getPractitionersByNameInteractor } from '@web-client/proxies/practitioners/getPractitionersByNameProxy';
import { getPrivatePractitionersBySearchKeyInteractor } from '@web-client/proxies/users/getPrivatePractitionersBySearchKeyProxy';
import { getScannerInterface } from './persistence/dynamsoft/getScannerInterface';
import { getScannerMockInterface } from './persistence/dynamsoft/getScannerMockInterface';
import { getSealedDocketEntryTooltip } from '../../shared/src/business/utilities/getSealedDocketEntryTooltip';
import { getSelectedConsolidatedCasesToMultiDocketOn } from '@web-client/business/utilities/getSelectedConsolidatedCasesToMultiDocketOn';
import { getStampBoxCoordinates } from '../../shared/src/business/utilities/getStampBoxCoordinates';
import { getStandaloneRemoteDocumentTitle } from '../../shared/src/business/utilities/getStandaloneRemoteDocumentTitle';
import { getTrialSessionDetailsInteractor } from '@web-client/proxies/trialSessions/getTrialSessionDetailsProxy';
import { getTrialSessionPlanningReportDataInteractor } from '@web-client/proxies/trialSessions/getTrialSessionPlanningReportProxy';
import { getTrialSessionWorkingCopyInteractor } from '@web-client/proxies/trialSessions/getTrialSessionWorkingCopyProxy';
import { getTrialSessionsForJudgeActivityReportInteractor } from '@web-client/proxies/reports/getTrialSessionsForJudgeActivityReportProxy';
import { getTrialSessionsForJudgeInteractor } from '@web-client/proxies/trialSessions/getTrialSessionsForJudgeProxy';
import { getTrialSessionsInteractor } from '@web-client/proxies/trialSessions/getTrialSessionsProxy';
import { getUserCaseNoteForCasesInteractor } from '@web-client/proxies/caseNote/getUserCaseNoteForCasesProxy';
import { getUserCaseNoteInteractor } from '@web-client/proxies/caseNote/getUserCaseNoteProxy';
import { getUserInteractor } from '@web-client/proxies/users/getUserProxy';
import { getUserPendingEmailInteractor } from '@web-client/proxies/users/getUserPendingEmailProxy';
import { getUserPendingEmailStatusInteractor } from '@web-client/proxies/users/getUserPendingEmailStatusProxy';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { getUsersInSectionInteractor } from '@web-client/proxies/users/getUsersInSectionProxy';
import { getUsersPendingEmailInteractor } from '@web-client/proxies/users/getUsersPendingEmailProxy';
import { loadPDFForPreviewInteractor } from '../../shared/src/business/useCases/loadPDFForPreviewInteractor';
import { loadPDFForSigningInteractor } from '../../shared/src/business/useCases/loadPDFForSigningInteractor';
import { logErrorInteractor } from '@web-client/proxies/logErrorProxy';
import { loginInteractor } from '@web-client/proxies/auth/loginProxy';
import { openUrlInNewTab } from './presenter/utilities/openUrlInNewTab';
import { opinionAdvancedSearchInteractor } from '@web-client/proxies/opinionAdvancedSearchProxy';
import { orderAdvancedSearchInteractor } from '@web-client/proxies/orderAdvancedSearchProxy';
import { removeCaseFromTrialInteractor } from '@web-client/proxies/trialSessions/removeCaseFromTrialProxy';
import { removeCasePendingItemInteractor } from '@web-client/proxies/removeCasePendingItemProxy';
import { removeConsolidatedCasesInteractor } from '@web-client/proxies/removeConsolidatedCasesProxy';
import { removeItem } from './persistence/localStorage/removeItem';
import { removeItemInteractor } from '../../shared/src/business/useCases/removeItemInteractor';
import { removePdfFromDocketEntryInteractor } from '@web-client/proxies/documents/removePdfFromDocketEntryProxy';
import { removePetitionerAndUpdateCaptionInteractor } from '@web-client/proxies/removePetitionerAndUpdateCaptionProxy';
import { removeSignatureFromDocumentInteractor } from '@web-client/proxies/documents/removeSignatureFromDocumentProxy';
import { renewIdTokenInteractor } from '@web-client/proxies/auth/renewIdTokenProxy';
import { replaceBracketed } from '../../shared/src/business/utilities/replaceBracketed';
import { replyToMessageInteractor } from '@web-client/proxies/messages/replyToMessageProxy';
import { runTrialSessionPlanningReportInteractor } from '@web-client/proxies/trialSessions/runTrialSessionPlanningReportProxy';
import { saveCalendarNoteInteractor } from '@web-client/proxies/trialSessions/saveCalendarNoteProxy';
import { saveCaseDetailInternalEditInteractor } from '@web-client/proxies/saveCaseDetailInternalEditProxy';
import { saveCaseNoteInteractor } from '@web-client/proxies/caseNote/saveCaseNoteProxy';
import { saveSignedDocumentInteractor } from '@web-client/proxies/documents/saveSignedDocumentProxy';
import { sealCaseContactAddressInteractor } from '@web-client/proxies/sealCaseContactAddressProxy';
import { sealCaseInteractor } from '@web-client/proxies/sealCaseProxy';
import { sealDocketEntryInteractor } from '@web-client/proxies/editDocketEntry/sealDocketEntryProxy';
import { serveCaseToIrsInteractor } from '@web-client/proxies/serveCaseToIrs/serveCaseToIrsProxy';
import { serveCourtIssuedDocumentInteractor } from '@web-client/proxies/serveCourtIssuedDocumentProxy';
import { serveExternallyFiledDocumentInteractor } from '@web-client/proxies/documents/serveExternallyFiledDocumentProxy';
import { serveThirtyDayNoticeInteractor } from '@web-client/proxies/trialSessions/serveThirtyDayNoticeProxy';
import { setConsolidationFlagsForDisplay } from '../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { setDocumentTitleFromStampDataInteractor } from '../../shared/src/business/useCases/stampMotion/setDocumentTitleFromStampDataInteractor';
import { setForHearingInteractor } from '@web-client/proxies/trialSessions/setForHearingProxy';
import { setItem } from './persistence/localStorage/setItem';
import { setItemInteractor } from '../../shared/src/business/useCases/setItemInteractor';
import { setMessageAsReadInteractor } from '@web-client/proxies/messages/setMessageAsReadProxy';
import { setNoticesForCalendaredTrialSessionInteractor } from '@web-client/proxies/trialSessions/setNoticesForCalendaredTrialSessionProxy';
import { setTrialSessionCalendarInteractor } from '@web-client/proxies/trialSessions/setTrialSessionCalendarProxy';
import { setWorkItemAsReadInteractor } from '@web-client/proxies/workitems/setWorkItemAsReadProxy';
import { setupPdfDocument } from '../../shared/src/business/utilities/setupPdfDocument';
import { signUpUserInteractor } from '@web-client/proxies/signUpUserProxy';
import { sleep } from '@shared/tools/helpers';
import { startPollingForResultsInteractor } from '@web-client/proxies/polling/startPollingForResultsProxy';
import { strikeDocketEntryInteractor } from '@web-client/proxies/editDocketEntry/strikeDocketEntryProxy';
import { submitCaseAssociationRequestInteractor } from '@web-client/proxies/documents/submitCaseAssociationRequestProxy';
import { submitPendingCaseAssociationRequestInteractor } from '@web-client/proxies/documents/submitPendingCaseAssociationRequestProxy';
import { transformFormValueToTitleCaseOrdinal } from '../../shared/src/business/utilities/transformFormValueToTitleCaseOrdinal';
import { tryCatchDecorator } from './tryCatchDecorator';
import { unblockCaseFromTrialInteractor } from '@web-client/proxies/unblockCaseFromTrialProxy';
import { unsealCaseInteractor } from '@web-client/proxies/unsealCaseProxy';
import { unsealDocketEntryInteractor } from '@web-client/proxies/editDocketEntry/unsealDocketEntryProxy';
import { updateCaseContextInteractor } from '@web-client/proxies/updateCaseContextProxy';
import { updateCaseDeadlineInteractor } from '@web-client/proxies/caseDeadline/updateCaseDeadlineProxy';
import { updateCaseDetailsInteractor } from '@web-client/proxies/updateCaseDetailsProxy';
import { updateCaseWorksheetInteractor } from '@web-client/proxies/caseWorksheet/updateCaseWorksheetProxy';
import { updateContactInteractor } from '@web-client/proxies/updateContactProxy';
import { updateCorrespondenceDocumentInteractor } from '@web-client/proxies/correspondence/updateCorrespondenceDocumentProxy';
import { updateCounselOnCaseInteractor } from '@web-client/proxies/caseAssociation/updateCounselOnCaseProxy';
import { updateCourtIssuedDocketEntryInteractor } from '@web-client/proxies/documents/updateCourtIssuedDocketEntryProxy';
import { updateCourtIssuedOrderInteractor } from '@web-client/proxies/courtIssuedOrder/updateCourtIssuedOrderProxy';
import { updateDeficiencyStatisticInteractor } from '@web-client/proxies/caseStatistics/updateDeficiencyStatisticProxy';
import { updateDocketEntryMetaInteractor } from '@web-client/proxies/documents/updateDocketEntryMetaProxy';
import { updateDocketEntryWorksheetInteractor } from '@web-client/proxies/pendingItems/updateDocketEntryWorksheetProxy';
import { updateOtherStatisticsInteractor } from '@web-client/proxies/caseStatistics/updateOtherStatisticsProxy';
import { updatePetitionerInformationInteractor } from '@web-client/proxies/updatePetitionerInformationProxy';
import { updatePractitionerUserInteractor } from '@web-client/proxies/practitioners/updatePractitionerUserProxy';
import { updateQcCompleteForTrialInteractor } from '@web-client/proxies/updateQcCompleteForTrialProxy';
import { updateTrialSessionInteractor } from '@web-client/proxies/trialSessions/updateTrialSessionProxy';
import { updateTrialSessionWorkingCopyInteractor } from '@web-client/proxies/trialSessions/updateTrialSessionWorkingCopyProxy';
import { updateUserCaseNoteInteractor } from '@web-client/proxies/caseNote/updateUserCaseNoteProxy';
import { updateUserContactInformationInteractor } from '@web-client/proxies/users/updateUserContactInformationProxy';
import { updateUserPendingEmailInteractor } from '@web-client/proxies/users/updateUserPendingEmailProxy';
import { uploadCorrespondenceDocumentInteractor } from '../../shared/src/business/useCases/correspondence/uploadCorrespondenceDocumentInteractor';
import { uploadDocumentAndMakeSafeInteractor } from '@web-client/business/useCases/uploadDocumentAndMakeSafeInteractor';
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
import { validateCaseWorksheetInteractor } from '@web-client/business/useCases/caseWorksheet/validateCaseWorksheetInteractor';
import { validateCourtIssuedDocketEntryInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/validateCourtIssuedDocketEntryInteractor';
import { validateCreateMessageInteractor } from '../../shared/src/business/useCases/messages/validateCreateMessageInteractor';
import { validateDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/validateDocketEntryInteractor';
import { validateDocketEntryWorksheetInteractor } from '@web-client/business/useCases/pendingMotion/validateDocketEntryWorksheetInteractor';
import { validateDocumentInteractor } from '../../shared/src/business/useCases/validateDocumentInteractor';
import { validateEditPetitionerCounselInteractor } from '../../shared/src/business/useCases/caseAssociation/validateEditPetitionerCounselInteractor';
import { validateExternalDocumentInformationInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInformationInteractor';
import { validateExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInteractor';
import { validateHearingNoteInteractor } from '../../shared/src/business/useCases/validateHearingNoteInteractor';
import { validateNoteInteractor } from '../../shared/src/business/useCases/caseNote/validateNoteInteractor';
import { validateOpinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOpinionAdvancedSearchInteractor';
import { validateOrderAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOrderAdvancedSearchInteractor';
import { validateOrderWithoutBodyInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/validateOrderWithoutBodyInteractor';
import { validatePdfInteractor } from '@web-client/proxies/documents/validatePdfProxy';
import { validateCaseForNewMinuteSheetInteractor } from '@web-client/proxies/trialSessionMinutes/validateCaseForNewMinuteSheetProxy';
import { getUnscheduledMinuteSheetsInteractor } from '@web-client/proxies/trialSessionMinutes/getUnscheduledMinuteSheetsProxy';
import { validatePenaltiesInteractor } from '@web-client/business/useCases/validatePenaltiesInteractor';
import { validatePetitionFromPaperInteractor } from '../../shared/src/business/useCases/validatePetitionFromPaperInteractor';
import { validatePetitionInteractor } from '../../shared/src/business/useCases/validatePetitionInteractor';
import { validatePetitionerInteractor } from '../../shared/src/business/useCases/validatePetitionerInteractor';
import { validatePractitionerInteractor } from '../../shared/src/business/useCases/practitioners/validatePractitionerInteractor';
import { validateSearchDeadlinesInteractor } from '../../shared/src/business/useCases/validateSearchDeadlinesInteractor';
import { validateStampInteractor } from '../../shared/src/business/useCases/stampMotion/validateStampInteractor';
import { validateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/validateTrialSessionInteractor';
import { validateUpdateUserEmailInteractor } from '../../shared/src/business/useCases/validateUpdateUserEmailInteractor';
import { validateUserContactInteractor } from '../../shared/src/business/useCases/users/validateUserContactInteractor';
import { verifyPendingCaseForUserInteractor } from '@web-client/proxies/verifyPendingCaseForUserProxy';
import { verifyUserPendingEmailInteractor } from '@web-client/proxies/users/verifyUserPendingEmailProxy';
import ImageBlobReduce from 'image-blob-reduce';
import deepFreeze from 'deep-freeze';
import { getTrialSessionOpenCasesCountInteractor } from '@web-client/proxies/trialSessions/getTrialSessionOpenCasesCountProxy';
import { getConsolidatedCaseDeadlinesInteractor } from '@web-client/proxies/caseDeadline/getConsolidatedCaseDeadlinesProxy';
import { removePetitionerEmailInteractor } from '@web-client/proxies/removePetitionerEmailProxy';

const reduce = ImageBlobReduce({
  pica: ImageBlobReduce.pica({ features: ['js'] }),
});

let user;
let broadcastChannel: BroadcastChannel;

let forceRefreshCallback: () => {};

const allUseCases = {
  addCaseToTrialSessionInteractor,
  addConsolidatedCaseInteractor,
  getDocketEntryProcessingStatusInteractor,
  addDeficiencyStatisticInteractor,
  addPaperFilingInteractor,
  addPetitionerToCaseInteractor,
  appendAmendedPetitionFormInteractor,
  archiveCorrespondenceDocumentInteractor,
  archiveDraftDocumentInteractor,
  assignWorkItemsInteractor,
  associateIrsPractitionerWithCaseInteractor,
  associatePrivatePractitionerWithCaseInteractor,
  batchDownloadDocketEntriesInteractor,
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
  forgotPasswordInteractor,
  forwardMessageInteractor,
  generateCaseAssociationDocumentTitleInteractor,
  generateDocketRecordPdfInteractor,
  generateDocumentIds,
  generateDraftStampOrderInteractor,
  generateEntryOfAppearancePdfInteractor,
  generateNoticeOfWithdrawalPdfInteractor,
  generatePDFFromJPGDataInteractor,
  generatePetitionPdfInteractor,
  generatePractitionerCaseListPdfInteractor,
  generatePrintableCaseInventoryReportInteractor,
  generatePrintableFilingReceiptInteractor,
  generatePrintablePendingReportInteractor,
  generatePrintableTrialSessionCopyReportInteractor,
  generateSignedDocumentInteractor,
  generateSuggestedTrialSessionCalendarInteractor,
  generateTrialCalendarPdfInteractor,
  getAllFeatureFlagsInteractor,
  getAllUsersByRoleInteractor,
  getBlockedCasesInteractor,
  getBulkSpecialTrialSessionCopyNotesInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseDeadlinesForCaseInteractor,
  getCaseDeadlinesInteractor,
  getCaseDocketEntriesInteractor,
  getConsolidatedCaseDeadlinesInteractor,
  getCaseExistsInteractor,
  getCaseInteractor,
  getCaseInventoryReportInteractor,
  getCaseWorksheetsByJudgeInteractor,
  getCasesClosedByJudgeInteractor,
  getCasesForUserInteractor,
  getClerkDashboardStatsInteractor,
  getColdCaseReportInteractor,
  getCompletedMessagesForSectionInteractor,
  getCompletedMessagesForUserInteractor,
  getCountOfCaseDocumentsFiledByJudgesInteractor,
  getDocumentContentsForDocketEntryInteractor,
  getDocumentDownloadUrlInteractor,
  getEligibleCasesForTrialSessionInteractor,
  getHealthCheckInteractor,
  getInboxMessagesForSectionInteractor,
  getInboxMessagesForUserInteractor,
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
  getPractitionerCasesInteractor,
  getPractitionerDocumentDownloadUrlInteractor,
  getPractitionerDocumentInteractor,
  getPractitionerDocumentsInteractor,
  getPractitionersByNameInteractor,
  getPrivatePractitionersBySearchKeyInteractor,
  getTrialSessionDetailsInteractor,
  getTrialSessionOpenCasesCountInteractor,
  getTrialSessionPlanningReportDataInteractor,
  getTrialSessionWorkingCopyInteractor,
  getTrialSessionsForJudgeActivityReportInteractor,
  getTrialSessionsForJudgeInteractor,
  getTrialSessionsInteractor,
  getUserCaseNoteForCasesInteractor,
  getUserCaseNoteInteractor,
  getUserInteractor,
  getUserPendingEmailInteractor,
  getUserPendingEmailStatusInteractor,
  getUsersInSectionInteractor,
  getUsersPendingEmailInteractor,
  loadPDFForPreviewInteractor,
  loadPDFForSigningInteractor,
  logErrorInteractor,
  loginInteractor,
  opinionAdvancedSearchInteractor,
  orderAdvancedSearchInteractor,
  removeCaseFromTrialInteractor,
  removeCasePendingItemInteractor,
  removeConsolidatedCasesInteractor,
  removeItemInteractor,
  removePdfFromDocketEntryInteractor,
  removePetitionerAndUpdateCaptionInteractor,
  removePetitionerEmailInteractor,
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
  startPollingForResultsInteractor,
  strikeDocketEntryInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  unblockCaseFromTrialInteractor,
  unsealCaseInteractor,
  unsealDocketEntryInteractor,
  updateCaseContextInteractor,
  updateCaseDeadlineInteractor,
  updateCaseDetailsInteractor,
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
  validateCaseForNewMinuteSheetInteractor,
  getUnscheduledMinuteSheetsInteractor,
  validatePenaltiesInteractor,
  validatePetitionFromPaperInteractor,
  validatePetitionInteractor,
  validatePetitionerInteractor,
  validatePractitionerInteractor,
  validateSearchDeadlinesInteractor,
  validateStampInteractor,
  validateTrialSessionInteractor,
  validateUpdateUserEmailInteractor,
  validateUserContactInteractor,
  verifyPendingCaseForUserInteractor,
  verifyUserPendingEmailInteractor,
};
tryCatchDecorator(allUseCases);

const appConstants = deepFreeze({
  ...getConstants(),
  ERROR_429,
}) as ReturnType<typeof getConstants>;

const applicationContext = {
  convertBlobToUInt8Array: async blob => {
    return new Uint8Array(await new Response(blob).arrayBuffer());
  },
  createCsvString: (
    data: any[],
    config: { displayLabel: string; key: string }[],
  ) => {
    const headers = config.map(c => `"${c.displayLabel}"`).join();
    const body = data.reduce((acc, currentData) => {
      const row = config
        .map(c => c.key)
        .map(key => `"${currentData[key]}"`)
        .join();
      acc += `${row}\n`;
      return acc;
    }, '');

    return `${headers}\n${body}`;
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
  getConstants: () => appConstants,
  getEnvironment,
  getFileReaderInstance: () => new FileReader(),
  getForceRefreshCallback() {
    return forceRefreshCallback;
  },
  getHttpClient: () => {
    return getHttpClient(forceRefreshCallback);
  },
  getPdfLib: () => {
    const pdfLib = import('pdf-lib');
    return pdfLib;
  },
  getPersistenceGateway: () => {
    return {
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
      downloadXlsx,
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
      getCaseDocumentsIdsFilteredByDocumentType,
      getClinicLetterKey,
      getContactPrimary,
      getContactSecondary,
      getCropBox,
      getDateFormat,
      getDescriptionDisplay,
      getDocketEntriesByFilter,
      getDocumentTitleWithAdditionalInfo,
      getFilingsAndProceedings,
      getFormattedCaseDetail,
      getFormattedPartiesNameAndTitle,
      getFormattedTrialSessionDetails,
      getJudgeLastName,
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
      hasPartyWithServiceType,
      isClosed,
      isCourtIssued: DocketEntry.isCourtIssued,
      isDateWithinGivenInterval,
      isExternalUser: User.isExternalUser,
      isInternalUser: User.isInternalUser,
      isLeadCase,
      isPending: DocketEntry.isPending,
      isSealedCase,
      isStringISOFormatted,
      isUserPartOfGroup,
      isValidDateString,
      isValidPastDate,
      openUrlInNewTab,
      prepareDateFromString,
      replaceBracketed,
      setConsolidationFlagsForDisplay,
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
  isPublicUser: () => false,
  setForceRefreshCallback(callback) {
    forceRefreshCallback = callback;
  },
  setTimeout: (callback: Function, timeout) => setTimeout(callback, timeout),
};

export { applicationContext };

type _ClientApplicationContext = typeof applicationContext;
export interface ClientApplicationContext extends _ClientApplicationContext {}

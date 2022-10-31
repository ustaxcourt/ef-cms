const {
  addDocketEntryForSystemGeneratedOrder,
} = require('../../shared/src/business/useCaseHelper/addDocketEntryForSystemGeneratedOrder');
const {
  addDraftStampOrderDocketEntryInteractor,
} = require('../../shared/src/business/useCaseHelper/stampDisposition/addDraftStampOrderDocketEntryInteractor');
const {
  addExistingUserToCase,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/addExistingUserToCase');
const {
  addServedStampToDocument,
} = require('../../shared/src/business/useCases/courtIssuedDocument/addServedStampToDocument');
const {
  appendPaperServiceAddressPageToPdf,
} = require('../../shared/src/business/useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  countPagesInDocument,
} = require('../../shared/src/business/useCaseHelper/countPagesInDocument');
const {
  createAndServeNoticeDocketEntry,
} = require('../../shared/src/business/useCaseHelper/docketEntry/createAndServeNoticeDocketEntry');
const {
  createCaseAndAssociations,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/createCaseAndAssociations');
const {
  createTrialSessionAndWorkingCopy,
} = require('../../shared/src/business/useCaseHelper/trialSessions/createTrialSessionAndWorkingCopy');
const {
  createUserForContact,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/createUserForContact');
const {
  fetchPendingItemsByDocketNumber,
} = require('../../shared/src/business/useCaseHelper/pendingItems/fetchPendingItemsByDocketNumber');
const {
  fileDocumentOnOneCase,
} = require('../../shared/src/business/useCaseHelper/docketEntry/fileDocumentOnOneCase');
const {
  formatAndSortConsolidatedCases,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/formatAndSortConsolidatedCases');
const {
  formatConsolidatedCaseCoversheetData,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/formatConsolidatedCaseCoversheetData');
const {
  generateAndServeDocketEntry,
} = require('../../shared/src/business/useCaseHelper/service/createChangeItems');
const {
  generateCaseInventoryReportPdf,
} = require('../../shared/src/business/useCaseHelper/caseInventoryReport/generateCaseInventoryReportPdf');
const {
  generateNoticeOfChangeToInPersonProceeding,
} = require('../../shared/src/business/useCaseHelper/trialSessions/generateNoticeOfChangeToInPersonProceeding');
const {
  generateStampedCoversheetInteractor,
} = require('../../shared/src/business/useCaseHelper/stampDisposition/generateStampedCoversheetInteractor');
const {
  getConsolidatedCasesForLeadCase,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/getConsolidatedCasesForLeadCase');
const {
  getJudgeInSectionHelper,
} = require('../../shared/src/business/useCaseHelper/getJudgeInSectionHelper');
const {
  getUnassociatedLeadCase,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/getUnassociatedLeadCase');
const {
  getUserIdForNote,
} = require('../../shared/src/business/useCaseHelper/getUserIdForNote');
const {
  parseAndScrapePdfContents,
} = require('../../shared/src/business/useCaseHelper/pdf/parseAndScrapePdfContents');
const {
  processUserAssociatedCases,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/processUserAssociatedCases');
const {
  removeCounselFromRemovedPetitioner,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/removeCounselFromRemovedPetitioner');
const {
  removeCoversheet,
} = require('../../shared/src/business/useCaseHelper/coverSheets/removeCoversheet');
const {
  saveFileAndGenerateUrl,
} = require('../../shared/src/business/useCaseHelper/saveFileAndGenerateUrl');
const {
  savePaperServicePdf,
} = require('../../shared/src/business/useCaseHelper/pdf/savePaperServicePdf');
const {
  sealInLowerEnvironment,
} = require('../../shared/src/business/useCaseHelper/sealInLowerEnvironment');
const {
  sendEmailVerificationLink,
} = require('../../shared/src/business/useCaseHelper/email/sendEmailVerificationLink');
const {
  sendIrsSuperuserPetitionEmail,
} = require('../../shared/src/business/useCaseHelper/service/sendIrsSuperuserPetitionEmail');
const {
  sendServedPartiesEmails,
} = require('../../shared/src/business/useCaseHelper/service/sendServedPartiesEmails');
const {
  serveDocumentAndGetPaperServicePdf,
} = require('../../shared/src/business/useCaseHelper/serveDocumentAndGetPaperServicePdf');
const {
  serveGeneratedNoticesOnCase,
} = require('../../shared/src/business/useCaseHelper/trialSessions/serveGeneratedNoticesOnCase');
const {
  setNoticeOfChangeOfTrialJudge,
} = require('../../shared/src/business/useCaseHelper/trialSessions/setNoticeOfChangeOfTrialJudge');
const {
  setNoticeOfChangeToInPersonProceeding,
} = require('../../shared/src/business/useCaseHelper/trialSessions/setNoticeOfChangeToInPersonProceeding');
const {
  setNoticeOfChangeToRemoteProceeding,
} = require('../../shared/src/business/useCaseHelper/trialSessions/setNoticeOfChangeToRemoteProceeding');
const {
  setPdfFormFields,
} = require('../../shared/src/business/useCaseHelper/pdf/setPdfFormFields');
const {
  stampDocumentForService,
} = require('../../shared/src/business/useCaseHelper/stampDocumentForService');
const {
  updateAssociatedJudgeOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateAssociatedJudgeOnWorkItems');
const {
  updateCaseAndAssociations,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations');
const {
  updateCaseAutomaticBlock,
} = require('../../shared/src/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock');
const {
  updateCaseStatusOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateCaseStatusOnWorkItems');
const {
  updateCaseTitleOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateCaseTitleOnWorkItems');
const {
  updateDocketNumberSuffixOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateDocketNumberSuffixOnWorkItems');
const {
  updateInitialFilingDocuments,
} = require('../../shared/src/business/useCaseHelper/initialFilingDocuments/updateInitialFilingDocuments');
const {
  updateTrialDateOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateTrialDateOnWorkItems');

const useCaseHelpers = {
  addDocketEntryForSystemGeneratedOrder,
  addDraftStampOrderDocketEntryInteractor,
  addExistingUserToCase,
  addServedStampToDocument,
  appendPaperServiceAddressPageToPdf,
  countPagesInDocument,
  createAndServeNoticeDocketEntry,
  createCaseAndAssociations,
  createTrialSessionAndWorkingCopy,
  createUserForContact,
  fetchPendingItemsByDocketNumber,
  fileDocumentOnOneCase,
  formatAndSortConsolidatedCases,
  formatConsolidatedCaseCoversheetData,
  generateAndServeDocketEntry,
  generateCaseInventoryReportPdf,
  generateNoticeOfChangeToInPersonProceeding,
  generateStampedCoversheetInteractor,
  getConsolidatedCasesForLeadCase,
  getJudgeInSectionHelper,
  getUnassociatedLeadCase,
  getUserIdForNote,
  parseAndScrapePdfContents,
  processUserAssociatedCases,
  removeCounselFromRemovedPetitioner,
  removeCoversheet,
  saveFileAndGenerateUrl,
  savePaperServicePdf,
  sealInLowerEnvironment,
  sendEmailVerificationLink,
  sendIrsSuperuserPetitionEmail,
  sendServedPartiesEmails,
  serveDocumentAndGetPaperServicePdf,
  serveGeneratedNoticesOnCase,
  setNoticeOfChangeOfTrialJudge,
  setNoticeOfChangeToInPersonProceeding,
  setNoticeOfChangeToRemoteProceeding,
  setPdfFormFields,
  stampDocumentForService,
  updateAssociatedJudgeOnWorkItems,
  updateCaseAndAssociations,
  updateCaseAutomaticBlock,
  updateCaseStatusOnWorkItems,
  updateCaseTitleOnWorkItems,
  updateDocketNumberSuffixOnWorkItems,
  updateInitialFilingDocuments,
  updateTrialDateOnWorkItems,
};

exports.getUseCaseHelpers = () => useCaseHelpers;

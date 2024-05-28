import { acquireLock } from './business/useCaseHelper/acquireLock';
import { addDocketEntryForSystemGeneratedOrder } from './business/useCaseHelper/addDocketEntryForSystemGeneratedOrder';
import { addDraftStampOrderDocketEntryInteractor } from './business/useCaseHelper/stampDisposition/addDraftStampOrderDocketEntryInteractor';
import { addExistingUserToCase } from './business/useCaseHelper/caseAssociation/addExistingUserToCase';
import { addServedStampToDocument } from '../../shared/src/business/useCases/courtIssuedDocument/addServedStampToDocument';
import { appendPaperServiceAddressPageToPdf } from './business/useCaseHelper/service/appendPaperServiceAddressPageToPdf';
import { associateIrsPractitionerToCase } from './business/useCaseHelper/caseAssociation/associateIrsPractitionerToCase';
import { associatePrivatePractitionerToCase } from './business/useCaseHelper/caseAssociation/associatePrivatePractitionerToCase';
import { associateSwingTrialSessions } from './business/useCaseHelper/trialSessions/associateSwingTrialSessions';
import { autoGenerateDeadline } from './business/useCaseHelper/autoGenerateDeadline';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments } from './business/useCaseHelper/docketEntry/closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';
import { countPagesInDocument } from './business/useCaseHelper/countPagesInDocument';
import { createAndServeNoticeDocketEntry } from './business/useCaseHelper/docketEntry/createAndServeNoticeDocketEntry';
import { createCaseAndAssociations } from './business/useCaseHelper/caseAssociation/createCaseAndAssociations';
import { createTrialSessionAndWorkingCopy } from './business/useCaseHelper/trialSessions/createTrialSessionAndWorkingCopy';
import { createUserConfirmation } from '@web-api/business/useCaseHelper/auth/createUserConfirmation';
import { createUserForContact } from './business/useCaseHelper/caseAssociation/createUserForContact';
import { fileAndServeDocumentOnOneCase } from './business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { formatConsolidatedCaseCoversheetData } from '@web-api/business/useCaseHelper/consolidatedCases/formatConsolidatedCaseCoversheetData';
import { generateAndServeDocketEntry } from './business/useCaseHelper/service/createChangeItems';
import { generateCaseInventoryReportPdf } from './business/useCaseHelper/caseInventoryReport/generateCaseInventoryReportPdf';
import { generateChangeOfAddressHelper } from './business/useCaseHelper/generateChangeOfAddressHelper';
import { generateNoticeOfChangeToInPersonProceeding } from './business/useCaseHelper/trialSessions/generateNoticeOfChangeToInPersonProceeding';
import { generatePdfFromHtmlHelper } from './business/useCaseHelper/generatePdfFromHtmlHelper';
import { generateStampedCoversheetInteractor } from './business/useCaseHelper/stampDisposition/generateStampedCoversheetInteractor';
import { getJudgeForUserHelper } from '@web-api/business/useCaseHelper/getJudgeForUserHelper';
import { getJudgeInSectionHelper } from './business/useCaseHelper/getJudgeInSectionHelper';
import { getUserIdForNote } from './business/useCaseHelper/getUserIdForNote';
import { parseAndScrapePdfContents } from './business/useCaseHelper/pdf/parseAndScrapePdfContents';
import { removeCounselFromRemovedPetitioner } from './business/useCaseHelper/caseAssociation/removeCounselFromRemovedPetitioner';
import { removeCoversheet } from '@web-api/business/useCaseHelper/coverSheets/removeCoversheet';
import { saveFileAndGenerateUrl } from './business/useCaseHelper/saveFileAndGenerateUrl';
import { sealInLowerEnvironment } from './business/useCaseHelper/sealInLowerEnvironment';
import { sendEmailVerificationLink } from './business/useCaseHelper/email/sendEmailVerificationLink';
import { sendIrsSuperuserPetitionEmail } from './business/useCaseHelper/service/sendIrsSuperuserPetitionEmail';
import { sendServedPartiesEmails } from './business/useCaseHelper/service/sendServedPartiesEmails';
import { serveDocumentAndGetPaperServicePdf } from './business/useCaseHelper/serveDocumentAndGetPaperServicePdf';
import { serveGeneratedNoticesOnCase } from './business/useCaseHelper/trialSessions/serveGeneratedNoticesOnCase';
import { setNoticeOfChangeOfTrialJudge } from './business/useCaseHelper/trialSessions/setNoticeOfChangeOfTrialJudge';
import { setNoticeOfChangeToInPersonProceeding } from './business/useCaseHelper/trialSessions/setNoticeOfChangeToInPersonProceeding';
import { setNoticeOfChangeToRemoteProceeding } from './business/useCaseHelper/trialSessions/setNoticeOfChangeToRemoteProceeding';
import { setPdfFormFields } from './business/useCaseHelper/pdf/setPdfFormFields';
import { stampDocumentForService } from './business/useCaseHelper/stampDocumentForService';
import { updateCaseAndAssociations } from './business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateCaseAutomaticBlock } from './business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { updateInitialFilingDocuments } from './business/useCaseHelper/initialFilingDocuments/updateInitialFilingDocuments';

const useCaseHelpers = {
  acquireLock,
  addDocketEntryForSystemGeneratedOrder,
  addDraftStampOrderDocketEntryInteractor,
  addExistingUserToCase,
  addServedStampToDocument,
  appendPaperServiceAddressPageToPdf,
  associateIrsPractitionerToCase,
  associatePrivatePractitionerToCase,
  associateSwingTrialSessions,
  autoGenerateDeadline,
  closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments,
  countPagesInDocument,
  createAndServeNoticeDocketEntry,
  createCaseAndAssociations,
  createTrialSessionAndWorkingCopy,
  createUserConfirmation,
  createUserForContact,
  fileAndServeDocumentOnOneCase,
  formatConsolidatedCaseCoversheetData,
  generateAndServeDocketEntry,
  generateCaseInventoryReportPdf,
  generateChangeOfAddressHelper,
  generateNoticeOfChangeToInPersonProceeding,
  generatePdfFromHtmlHelper,
  generateStampedCoversheetInteractor,
  getJudgeForUserHelper,
  getJudgeInSectionHelper,
  getUserIdForNote,
  parseAndScrapePdfContents,
  removeCounselFromRemovedPetitioner,
  removeCoversheet,
  saveFileAndGenerateUrl,
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
  updateCaseAndAssociations,
  updateCaseAutomaticBlock,
  updateInitialFilingDocuments,
};

export const getUseCaseHelpers = () => useCaseHelpers;

type _IGetUseCaseHelpers = typeof getUseCaseHelpers;

declare global {
  interface IGetUseCaseHelpers extends _IGetUseCaseHelpers {}
}

import { AccessibilityStatement } from './Accessibility/AccessibilityStatement';
import { AddDeficiencyStatistics } from './CaseDetail/AddDeficiencyStatistics';
import { AddDocketEntry } from './AddDocketEntry/AddDocketEntry';
import { AddOtherStatistics } from './CaseDetail/AddOtherStatistics';
import { AddTrialSession } from './TrialSessions/AddTrialSession';
import { AdvancedSearch } from './AdvancedSearch/AdvancedSearch';
import { BatchDownloadProgress } from './TrialSessionWorkingCopy/BatchDownloadProgress';
import { BeforeStartingCase } from './BeforeStartingCase';
import { BeforeYouFileADocument } from './FileDocument/BeforeYouFileADocument';
import { BlockedCasesReport } from './BlockedCasesReport/BlockedCasesReport';
import { CaseDeadlines } from './CaseDeadlines/CaseDeadlines';
import { CaseDetail } from './CaseDetail/CaseDetail';
import { CaseDetailInternal } from './CaseDetail/CaseDetailInternal';
import { CaseInventoryReport } from './CaseInventoryReport/CaseInventoryReport';
import { CaseInventoryReportModal } from './CaseInventoryReport/CaseInventoryReportModal';
import { CaseMessages } from './Messages/CaseMessages';
import { CaseSearchNoMatches } from './CaseSearchNoMatches';
import { CourtIssuedDocketEntry } from './CourtIssuedDocketEntry/CourtIssuedDocketEntry';
import { CreateOrder } from './CreateOrder/CreateOrder';
import { CreatePractitionerUser } from './Practitioners/CreatePractitionerUser';
import { DashboardChambers } from './Dashboards/DashboardChambers';
import { DashboardInactive } from './Dashboards/DashboardInactive';
import { DashboardIrsSuperuser } from './Dashboards/DashboardIrsSuperuser';
import { DashboardJudge } from './Dashboards/DashboardJudge';
import { DashboardPetitioner } from './Dashboards/DashboardPetitioner';
import { DashboardPractitioner } from './Dashboards/DashboardPractitioner';
import { DashboardRespondent } from './Dashboards/DashboardRespondent';
import { EditCorrespondenceDocument } from './Correspondence/EditCorrespondenceDocument';
import { EditDeficiencyStatistic } from './CaseDetail/EditDeficiencyStatistic';
import { EditDocketEntry } from './EditDocketEntry/EditDocketEntry';
import { EditDocketEntryMeta } from './EditDocketEntry/EditDocketEntryMeta';
import { EditOtherStatistics } from './CaseDetail/EditOtherStatistics';
import { EditPetitionDetails } from './CaseDetail/EditPetitionDetails';
import { EditPetitionerInformation } from './CaseDetail/EditPetitionerInformation';
import { EditPractitionerUser } from './Practitioners/EditPractitionerUser';
import { EditTrialSession } from './TrialSessions/EditTrialSession';
import { EditUploadCourtIssuedDocument } from './EditUploadCourtIssuedDocument/EditUploadCourtIssuedDocument';
import { Error } from './Error';
import { FileCompressionErrorModal } from './TrialSessionWorkingCopy/FileCompressionErrorModal';
import { FileDocumentWizard } from './FileDocument/FileDocumentWizard';
import { FilePetitionSuccess } from './StartCase/FilePetitionSuccess';
import { Footer } from './Footer';
import { Header } from './Header/Header';
import { IdleLogout } from './IdleLogout';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { LogIn } from './LogIn';
import { MessageDetail } from './Messages/MessageDetail';
import { Messages } from './Messages/Messages';
import { OtherFilerInformation } from './CaseDetail/OtherFilerInformation';
import { PendingReport } from './PendingReport/PendingReport';
import { PetitionQc } from './PetitionQc/PetitionQc';
import { PractitionerDetail } from './Practitioners/PractitionerDetail';
import { PrimaryContactEdit } from './PrimaryContactEdit';
import { PrintPaperPetitionReceipt } from './PetitionQc/PrintPaperPetitionReceipt';
import { PrintPaperService } from './PrintPaperService';
import { PrintableCaseInventoryReport } from './CaseInventoryReport/PrintableCaseInventoryReport';
import { PrintableDocketRecord } from './DocketRecord/PrintableDocketRecord';
import { PrintableTrialCalendar } from './TrialSessionDetail/PrintableTrialCalendar';
import { RequestAccessWizard } from './RequestAccess/RequestAccessWizard';
import { ReviewSavedPetition } from './CaseDetailEdit/ReviewSavedPetition';
import { SecondaryContactEdit } from './SecondaryContactEdit';
import { SelectDocumentType } from './FileDocument/SelectDocumentType';
import { SignOrder } from './SignOrder';
import { SignStipDecision } from './SignStipDecision';
import { SimplePdfPreviewPage } from './PendingReport/SimplePdfPreviewPage';
import { StartCaseInternal } from './StartCaseInternal/StartCaseInternal';
import { StartCaseWizard } from './StartCase/StartCaseWizard';
import { StyleGuide } from './StyleGuide/StyleGuide';
import { TrialSessionDetail } from './TrialSessionDetail/TrialSessionDetail';
import { TrialSessionPlanningModal } from './TrialSessionPlanningModal';
import { TrialSessionPlanningReport } from './TrialSessions/TrialSessionPlanningReport';
import { TrialSessionWorkingCopy } from './TrialSessionWorkingCopy/TrialSessionWorkingCopy';
import { TrialSessions } from './TrialSessions/TrialSessions';
import { UploadCorrespondenceDocument } from './Correspondence/UploadCorrespondenceDocument';
import { UploadCourtIssuedDocument } from './UploadCourtIssuedDocument/UploadCourtIssuedDocument';
import { UsaBanner } from './UsaBanner';
import { UserContactEdit } from './UserContactEdit';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect } from 'react';

const pages = {
  AccessibilityStatement,
  AddDeficiencyStatistics,
  AddDocketEntry,
  AddOtherStatistics,
  AddTrialSession,
  AdvancedSearch,
  BeforeStartingCase,
  BeforeYouFileADocument,
  BlockedCasesReport,
  CaseDeadlines,
  CaseDetail,
  CaseDetailInternal,
  CaseInventoryReport,
  CaseMessages,
  CaseSearchNoMatches,
  CourtIssuedDocketEntry,
  CreateOrder,
  CreatePractitionerUser,
  DashboardChambers,
  DashboardInactive,
  DashboardIrsSuperuser,
  DashboardJudge,
  DashboardPetitioner,
  DashboardPractitioner,
  DashboardRespondent,
  EditCorrespondenceDocument,
  EditDeficiencyStatistic,
  EditDocketEntry,
  EditDocketEntryMeta,
  EditOtherStatistics,
  EditPetitionDetails,
  EditPetitionerInformation,
  EditPractitionerUser,
  EditTrialSession,
  EditUploadCourtIssuedDocument,
  Error,
  FileDocumentWizard,
  FilePetitionSuccess,
  IdleLogout,
  Interstitial,
  Loading,
  LogIn,
  MessageDetail,
  Messages,
  OtherFilerInformation,
  PendingReport,
  PetitionQc,
  PractitionerDetail,
  PrimaryContactEdit,
  PrintPaperPetitionReceipt,
  PrintPaperService,
  PrintableCaseInventoryReport,
  PrintableDocketRecord,
  PrintableTrialCalendar,
  RequestAccessWizard,
  ReviewSavedPetition,
  SecondaryContactEdit,
  SelectDocumentType,
  SignOrder,
  SignStipDecision,
  SimplePdfPreviewPage,
  StartCaseInternal,
  StartCaseWizard,
  StyleGuide,
  TrialSessionDetail,
  TrialSessionPlanningReport,
  TrialSessionWorkingCopy,
  TrialSessions,
  UploadCorrespondenceDocument,
  UploadCourtIssuedDocument,
  UserContactEdit,
};

/**
 * Root application component
 */
export const AppComponent = connect(
  {
    currentPage: state.currentPage,
    showModal: state.modal.showModal,
    zipInProgress: state.batchDownloads.zipInProgress,
  },
  function AppComponent({ currentPage, showModal, zipInProgress }) {
    const focusMain = e => {
      e && e.preventDefault();
      const header = document.querySelector('#main-content h1');
      if (header) header.focus();
      return;
    };

    useEffect(() => {
      focusMain();
    }, [currentPage]);

    const CurrentPage = pages[currentPage];
    return (
      <>
        <a
          className="usa-skipnav"
          href="#main-content"
          tabIndex="0"
          onClick={focusMain}
        >
          Skip to main content
        </a>
        <UsaBanner />
        <Header />
        <main id="main-content" role="main">
          <CurrentPage />
          {zipInProgress && <BatchDownloadProgress />}
        </main>
        <Footer />
        <Loading />
        {showModal === 'TrialSessionPlanningModal' && (
          <TrialSessionPlanningModal />
        )}
        {showModal === 'CaseInventoryReportModal' && (
          <CaseInventoryReportModal />
        )}
        {showModal === 'FileCompressionErrorModal' && (
          <FileCompressionErrorModal />
        )}
      </>
    );
  },
);

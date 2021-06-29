import { AccessibilityStatement } from './Accessibility/AccessibilityStatement';
import { AddDeficiencyStatistics } from './CaseDetail/AddDeficiencyStatistics';
import { AddOtherStatistics } from './CaseDetail/AddOtherStatistics';
import { AddPetitionerToCase } from './AddPetitionerToCase/AddPetitionerToCase';
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
import { CaseSearchNoMatches } from './CaseSearchNoMatches';
import { ChangeLoginAndServiceEmail } from './ChangeLoginAndServiceEmail';
import { Contact } from './Contact';
import { ContactEdit } from './ContactEdit';
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
import { DocketEntryQc } from './DocketEntryQc';
import { EditCorrespondenceDocument } from './Correspondence/EditCorrespondenceDocument';
import { EditDeficiencyStatistic } from './CaseDetail/EditDeficiencyStatistic';
import { EditDocketEntryMeta } from './EditDocketEntry/EditDocketEntryMeta';
import { EditOtherStatistics } from './CaseDetail/EditOtherStatistics';
import { EditPetitionDetails } from './CaseDetail/EditPetitionDetails';
import { EditPetitionerCounsel } from './EditPetitionerCounsel';
import { EditPetitionerInformationInternal } from './EditPetitionerInformationInternal';
import { EditPractitionerUser } from './Practitioners/EditPractitionerUser';
import { EditRespondentCounsel } from './EditRespondentCounsel';
import { EditTrialSession } from './TrialSessions/EditTrialSession';
import { EditUploadCourtIssuedDocument } from './EditUploadCourtIssuedDocument/EditUploadCourtIssuedDocument';
import { ErrorView } from './Error';
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
import { MyAccount } from './MyAccount';
import { PaperFiling } from './PaperFiling/PaperFiling';
import { PendingReport } from './PendingReport/PendingReport';
import { PetitionQc } from './PetitionQc/PetitionQc';
import { PractitionerDetail } from './Practitioners/PractitionerDetail';
import { PrintPaperPetitionReceipt } from './PetitionQc/PrintPaperPetitionReceipt';
import { PrintPaperService } from './PrintPaperService';
import { PrintPaperTrialNotices } from './PrintPaperTrialNotices';
import { PrintableCaseInventoryReport } from './CaseInventoryReport/PrintableCaseInventoryReport';
import { PrintableDocketRecord } from './DocketRecord/PrintableDocketRecord';
import { PrintableTrialCalendar } from './TrialSessionDetail/PrintableTrialCalendar';
import { Privacy } from './Privacy';
import { RequestAccessWizard } from './RequestAccess/RequestAccessWizard';
import { ReviewSavedPetition } from './CaseDetailEdit/ReviewSavedPetition';
import { SelectDocumentType } from './FileDocument/SelectDocumentType';
import { SignOrder } from './SignOrder';
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
import { UserContactEditProgress } from './UserContactEditProgress';
import { WebSocketErrorModal } from './WebSocketErrorModal';
import { WorkQueue } from './WorkQueue';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect } from 'react';

const pages = {
  AccessibilityStatement,
  AddDeficiencyStatistics,
  AddOtherStatistics,
  AddPetitionerToCase,
  AddTrialSession,
  AdvancedSearch,
  BeforeStartingCase,
  BeforeYouFileADocument,
  BlockedCasesReport,
  CaseDeadlines,
  CaseDetail,
  CaseDetailInternal,
  CaseInventoryReport,
  CaseSearchNoMatches,
  ChangeLoginAndServiceEmail,
  Contact,
  ContactEdit,
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
  DocketEntryQc,
  EditCorrespondenceDocument,
  EditDeficiencyStatistic,
  EditDocketEntryMeta,
  EditOtherStatistics,
  EditPetitionDetails,
  EditPetitionerCounsel,
  EditPetitionerInformationInternal,
  EditPractitionerUser,
  EditRespondentCounsel,
  EditTrialSession,
  EditUploadCourtIssuedDocument,
  ErrorView,
  FileDocumentWizard,
  FilePetitionSuccess,
  IdleLogout,
  Interstitial,
  Loading,
  LogIn,
  MessageDetail,
  Messages,
  MyAccount,
  PaperFiling,
  PendingReport,
  PetitionQc,
  PractitionerDetail,
  PrintPaperPetitionReceipt,
  PrintPaperService,
  PrintPaperTrialNotices,
  PrintableCaseInventoryReport,
  PrintableDocketRecord,
  PrintableTrialCalendar,
  Privacy,
  RequestAccessWizard,
  ReviewSavedPetition,
  SelectDocumentType,
  SignOrder,
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
  UserContactEditProgress,
  WorkQueue,
};

let initialPageLoaded = false;

/**
 * Root application component
 */
export const AppComponent = connect(
  {
    currentPage: state.currentPage,
    showModal: state.modal.showModal,
    token: state.token,
    userContactEditInProgress: state.userContactEditProgress.inProgress,
    zipInProgress: state.batchDownloads.zipInProgress,
  },
  function AppComponent({
    currentPage,
    showModal,
    userContactEditInProgress,
    zipInProgress,
  }) {
    const focusMain = e => {
      e && e.preventDefault();
      const header = window.document.querySelector('#main-content h1');
      if (header) header.focus();
      return;
    };

    useEffect(() => {
      if (initialPageLoaded) {
        focusMain();
      }
      if (currentPage !== 'Interstitial') {
        initialPageLoaded = true;
      }
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
          {userContactEditInProgress && <UserContactEditProgress />}
        </main>
        <Loading />

        <Footer />
        {zipInProgress && <BatchDownloadProgress />}

        {showModal === 'TrialSessionPlanningModal' && (
          <TrialSessionPlanningModal />
        )}
        {showModal === 'CaseInventoryReportModal' && (
          <CaseInventoryReportModal />
        )}
        {showModal === 'FileCompressionErrorModal' && (
          <FileCompressionErrorModal />
        )}
        {showModal === 'WebSocketErrorModal' && <WebSocketErrorModal />}
      </>
    );
  },
);

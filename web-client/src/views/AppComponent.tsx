import { AccessibilityStatement } from './Accessibility/AccessibilityStatement';
import { AddCorrespondenceDocument } from './Correspondence/AddCorrespondenceDocument';
import { AddDeficiencyStatistics } from './CaseDetail/AddDeficiencyStatistics';
import { AddOtherStatistics } from './CaseDetail/AddOtherStatistics';
import { AddPetitionerToCase } from './AddPetitionerToCase/AddPetitionerToCase';
import { AddTrialSession } from './TrialSessions/AddTrialSession';
import { AdvancedSearch } from './AdvancedSearch/AdvancedSearch';
import { AppMaintenance } from './AppMaintenance';
import { AppMaintenanceModal } from './AppMaintenanceModal';
import { ApplyStamp } from './StampMotion/ApplyStamp';
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
import { ChangePassword } from '@web-client/views/Login/ChangePassword';
import { Contact } from './Contact';
import { ContactEdit } from './ContactEdit';
import { CourtIssuedDocketEntry } from './CourtIssuedDocketEntry/CourtIssuedDocketEntry';
import { CreateOrder } from './CreateOrder/CreateOrder';
import { CreatePetitionerAccount } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccount';
import { CreatePractitionerUser } from './Practitioners/CreatePractitionerUser';
import { CustomCaseReport } from './CustomCaseReport/CustomCaseReport';
import { DashboardChambers } from './Dashboards/DashboardChambers';
import { DashboardInactive } from './Dashboards/DashboardInactive';
import { DashboardIrsSuperuser } from './Dashboards/DashboardIrsSuperuser';
import { DashboardJudge } from './Dashboards/DashboardJudge';
import { DashboardPetitioner } from './Dashboards/DashboardPetitioner';
import { DashboardPractitioner } from './Dashboards/DashboardPractitioner';
import { DashboardRespondent } from './Dashboards/DashboardRespondent';
import { DocketEntryQc } from './DocketEntryQc';
import { EditCaseDetails } from './CaseDetail/EditCaseDetails';
import { EditCorrespondenceDocument } from './Correspondence/EditCorrespondenceDocument';
import { EditDeficiencyStatistic } from './CaseDetail/EditDeficiencyStatistic';
import { EditDocketEntryMeta } from './EditDocketEntry/EditDocketEntryMeta';
import { EditOtherStatistics } from './CaseDetail/EditOtherStatistics';
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
import { ForgotPassword } from '@web-client/views/Login/ForgotPassword';
import { GenericErrorModal } from './GenericErrorModal';
import { Header } from './Header/Header';
import { IdleLogout } from './IdleLogout';
import { Interstitial } from './Interstitial';
import { JudgeActivityReport } from './JudgeActivityReport/JudgeActivityReport';
import { Loading } from './Loading';
import { Login } from '@web-client/views/Login/Login';
import { MessageDetail } from './Messages/MessageDetail';
import { Messages } from './Messages/Messages';
import { MyAccount } from './MyAccount';
import { OldLogin } from './OldLogin';
import { PaperFiling } from './PaperFiling/PaperFiling';
import { PendingReport } from './PendingReport/PendingReport';
import { PetitionQc } from './PetitionQc/PetitionQc';
import { PractitionerAddEditDocument } from './Practitioners/PractitionerAddEditDocument';
import { PractitionerInformation } from './Practitioners/PractitionerInformation';
import { PrintPaperPetitionReceipt } from './PetitionQc/PrintPaperPetitionReceipt';
import { PrintPaperService } from './PrintPaperService';
import { PrintPaperTrialNotices } from './PrintPaperTrialNotices';
import { PrintableCaseInventoryReport } from './CaseInventoryReport/PrintableCaseInventoryReport';
import { PrintableDocketRecord } from './DocketRecord/PrintableDocketRecord';
import { PrintableTrialCalendar } from './TrialSessionDetail/PrintableTrialCalendar';
import { PrintableTrialSessionWorkingCopyModal } from './TrialSessionWorkingCopy/PrintableTrialSessionWorkingCopyModal';
import { PrintableTrialSessionWorkingCopyPreviewPage } from './TrialSessionWorkingCopy/PrintableTrialSessionWorkingCopyPreviewPage';
import { Privacy } from './Privacy';
import { RequestAccessWizard } from './RequestAccess/RequestAccessWizard';
import { ReviewSavedPetition } from './CaseDetailEdit/ReviewSavedPetition';
import { SealedCaseDetail } from './CaseDetail/SealedCaseDetail';
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
import { UploadCourtIssuedDocument } from './UploadCourtIssuedDocument/UploadCourtIssuedDocument';
import { UsaBanner } from './UsaBanner';
import { UserContactEdit } from './UserContactEdit';
import { UserContactEditProgress } from './UserContactEditProgress';
import { VerificationSent } from '@web-client/views/CreatePetitionerAccount/VerificationSent';
import { WebSocketErrorModal } from './WebSocketErrorModal';
import { WorkQueue } from './WorkQueue';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

const pages = {
  AccessibilityStatement,
  AddCorrespondenceDocument,
  AddDeficiencyStatistics,
  AddOtherStatistics,
  AddPetitionerToCase,
  AddTrialSession,
  AdvancedSearch,
  AppMaintenance,
  ApplyStamp,
  BeforeStartingCase,
  BeforeYouFileADocument,
  BlockedCasesReport,
  CaseDeadlines,
  CaseDetail,
  CaseDetailInternal,
  CaseInventoryReport,
  CaseSearchNoMatches,
  ChangeLoginAndServiceEmail,
  ChangePassword,
  Contact,
  ContactEdit,
  CourtIssuedDocketEntry,
  CreateOrder,
  CreatePetitionerAccount,
  CreatePractitionerUser,
  CustomCaseReport,
  DashboardChambers,
  DashboardInactive,
  DashboardIrsSuperuser,
  DashboardJudge,
  DashboardPetitioner,
  DashboardPractitioner,
  DashboardRespondent,
  DocketEntryQc,
  EditCaseDetails,
  EditCorrespondenceDocument,
  EditDeficiencyStatistic,
  EditDocketEntryMeta,
  EditOtherStatistics,
  EditPetitionerCounsel,
  EditPetitionerInformationInternal,
  EditPractitionerUser,
  EditRespondentCounsel,
  EditTrialSession,
  EditUploadCourtIssuedDocument,
  ErrorView,
  FileDocumentWizard,
  FilePetitionSuccess,
  ForgotPassword,
  IdleLogout,
  Interstitial,
  JudgeActivityReport,
  Loading,
  Login,
  MessageDetail,
  Messages,
  MyAccount,
  OldLogin,
  PaperFiling,
  PendingReport,
  PetitionQc,
  PractitionerAddEditDocument,
  PractitionerInformation,
  PrintPaperPetitionReceipt,
  PrintPaperService,
  PrintPaperTrialNotices,
  PrintableCaseInventoryReport,
  PrintableDocketRecord,
  PrintableTrialCalendar,
  PrintableTrialSessionWorkingCopyPreviewPage,
  Privacy,
  RequestAccessWizard,
  ReviewSavedPetition,
  SealedCaseDetail,
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
  UploadCourtIssuedDocument,
  UserContactEdit,
  UserContactEditProgress,
  VerificationSent,
  WorkQueue,
};

const pagesWithBlueBackground = {
  ChangePassword,
  CreatePetitionerAccount,
  ForgotPassword,
  Login,
  VerificationSent,
};

let initialPageLoaded = false;

export const AppComponent = connect(
  {
    currentPage: state.currentPage,
    showModal: state.modal.showModal,
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

    let showHeaderAndFooter = currentPage !== 'AppMaintenance';

    const CurrentPage = pages[currentPage];
    const IsPageWithBlueBackground = pagesWithBlueBackground[currentPage];

    return (
      <>
        {showHeaderAndFooter && (
          <>
            <a
              className="usa-skipnav"
              href="#main-content"
              tabIndex={0}
              onClick={focusMain}
            >
              Skip to main content
            </a>
            <UsaBanner />
            <Header />
          </>
        )}

        <main
          className={classNames(
            IsPageWithBlueBackground ? 'background-blue' : '',
          )}
          id="main-content"
          role="main"
        >
          <CurrentPage />
          {userContactEditInProgress && <UserContactEditProgress />}
        </main>

        <Loading />

        {showHeaderAndFooter && (
          <>
            <Footer />
            {zipInProgress && <BatchDownloadProgress />}

            {showModal === 'TrialSessionPlanningModal' && (
              <TrialSessionPlanningModal />
            )}
            {showModal === 'PrintableTrialSessionWorkingCopyModal' && (
              <PrintableTrialSessionWorkingCopyModal />
            )}
            {showModal === 'CaseInventoryReportModal' && (
              <CaseInventoryReportModal />
            )}
            {showModal === 'FileCompressionErrorModal' && (
              <FileCompressionErrorModal />
            )}
            {showModal === 'WebSocketErrorModal' && <WebSocketErrorModal />}
          </>
        )}
        {showModal === 'WebSocketErrorModal' && <WebSocketErrorModal />}
        {showModal === 'AppMaintenanceModal' && <AppMaintenanceModal />}
        {showModal === 'GenericErrorModal' && <GenericErrorModal />}
      </>
    );
  },
);

AppComponent.displayName = 'AppComponent';

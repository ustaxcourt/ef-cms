import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddToTrialModal } from './AddToTrialModal';
import { BlockFromTrialModal } from './BlockFromTrialModal';
import { CaseDeadlinesInternal } from './CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailPendingReportList } from './CaseDetailPendingReportList';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationInternal } from './CaseInformationInternal';
import { CaseNotes } from './CaseNotes';
import { CreateCaseDeadlineModalDialog } from './CreateCaseDeadlineModalDialog';
import { CreateOrderChooseTypeModal } from '../CreateOrder/CreateOrderChooseTypeModal';
import { DeleteCaseDeadlineModalDialog } from './DeleteCaseDeadlineModalDialog';
import { DocketRecord } from '../DocketRecord/DocketRecord';
import { DraftDocuments } from '../DraftDocuments/DraftDocuments';
import { EditCaseDeadlineModalDialog } from './EditCaseDeadlineModalDialog';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessagesInProgress } from './MessagesInProgress';
import { PetitionerInformation } from './PetitionerInformation';
import { PrioritizeCaseModal } from './PrioritizeCaseModal';
import { RemoveFromTrialSessionModal } from './RemoveFromTrialSessionModal';
import { RespondentInformation } from './RespondentInformation';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { UnblockFromTrialModal } from './UnblockFromTrialModal';
import { UnprioritizeCaseModal } from './UnprioritizeCaseModal';
import { UpdateCaseModalDialog } from '../CaseDetailEdit/UpdateCaseModalDialog';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    formattedCaseDetail: state.formattedCaseDetail,
    primaryTab: state.caseDetailPage.primaryTab,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    formattedCaseDetail,
    primaryTab,
    showModal,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-0" />
        <CaseDetailSubnavTabs />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <SuccessNotification />
          <ErrorNotification />
          {primaryTab === 'docketRecord' && (
            <>
              <div className="title">
                <h1>Docket Record</h1>
              </div>
              <DocketRecord />
            </>
          )}
          {primaryTab === 'deadlines' && (
            <>
              <div className="title">
                <h1>Deadlines</h1>
              </div>
              <CaseDeadlinesInternal />
            </>
          )}
          {primaryTab === 'inProgress' && (
            <Tabs
              bind="caseDetailPage.inProgressTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-draft-documents"
                tabName="draftDocuments"
                title="Draft Documents"
              >
                <DraftDocuments />
              </Tab>
              <Tab id="tab-messages" tabName="messages" title="Messages">
                <MessagesInProgress />
              </Tab>
              <Tab
                id="tab-pending-report"
                tabName="pendingReport"
                title="Pending Report"
              >
                <CaseDetailPendingReportList />
              </Tab>
            </Tabs>
          )}
          {primaryTab === 'caseInformation' && (
            <Tabs
              bind="caseDetailPage.caseInformationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-overview" tabName="overview" title="Overview">
                <CaseInformationInternal />
              </Tab>
              <Tab id="tab-petitioner" tabName="petitioner" title="Petitioner">
                <PetitionerInformation />
              </Tab>
              <Tab id="tab-respondent" tabName="respondent" title="Respondent">
                <RespondentInformation />
              </Tab>
            </Tabs>
          )}
          {primaryTab === 'notes' && (
            <>
              <div className="title">
                <h1>Notes</h1>
              </div>
              <CaseNotes />
            </>
          )}
        </section>

        {/* This section below will be removed in a future story */}
        <section className="usa-section grid-container">
          {formattedCaseDetail.status === 'General Docket - Not at Issue' && (
            <>
              {formattedCaseDetail.contactPrimary && (
                <a
                  aria-label="View PDF"
                  className="usa-button usa-button--unstyled margin-right-1"
                  href={`${baseUrl}/case-documents/${caseDetail.caseId}/${
                    formattedCaseDetail.docketNumber
                  }_${formattedCaseDetail.contactPrimary.name.replace(
                    /\s/g,
                    '_',
                  )}.zip/document-download-url?token=${token}`}
                >
                  <FontAwesomeIcon icon={['far', 'file-pdf']} />
                  Batch Zip Download
                </a>
              )}
            </>
          )}
        </section>

        {showModal === 'CreateCaseDeadlineModalDialog' && (
          <CreateCaseDeadlineModalDialog />
        )}
        {showModal === 'EditCaseDeadlineModalDialog' && (
          <EditCaseDeadlineModalDialog />
        )}
        {showModal === 'DeleteCaseDeadlineModalDialog' && (
          <DeleteCaseDeadlineModalDialog />
        )}
        {showModal === 'AddEditCaseNoteModal' && (
          <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteSequence" />
        )}
        {showModal === 'AddToTrialModal' && <AddToTrialModal />}
        {showModal === 'BlockFromTrialModal' && <BlockFromTrialModal />}
        {showModal === 'UnblockFromTrialModal' && <UnblockFromTrialModal />}
        {showModal === 'PrioritizeCaseModal' && <PrioritizeCaseModal />}
        {showModal === 'UnprioritizeCaseModal' && <UnprioritizeCaseModal />}
        {showModal === 'RemoveFromTrialSessionModal' && (
          <RemoveFromTrialSessionModal />
        )}
        {showModal === 'CreateOrderChooseTypeModal' && (
          <CreateOrderChooseTypeModal />
        )}
        {showModal == 'UpdateCaseModalDialog' && <UpdateCaseModalDialog />}
      </>
    );
  },
);

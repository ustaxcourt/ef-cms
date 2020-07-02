import { CaseDeadlinesInternal } from './CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailPendingReportList } from './CaseDetailPendingReportList';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationInternal } from './CaseInformationInternal';
import { CaseMessagesCompleted } from './CaseMessagesCompleted';
import { CaseMessagesInProgress } from './CaseMessagesInProgress';
import { CaseNotes } from './CaseNotes';
import { Correspondence } from '../Correspondence/Correspondence';
import { DocketRecord } from '../DocketRecord/DocketRecord';
import { DraftDocuments } from '../DraftDocuments/DraftDocuments';
import { EditPetitionDetails } from './EditPetitionDetails';
import { ErrorNotification } from '../ErrorNotification';
import { OtherFilerInformation } from './OtherFilerInformation';
import { PaperServiceConfirmModal } from './PaperServiceConfirmModal';
import { PetitionerInformation } from './PetitionerInformation';
import { RespondentInformation } from './RespondentInformation';
import { SealCaseModal } from './SealCaseModal';
import { Statistics } from './Statistics';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    caseDetailInternalTabs:
      state.currentViewMetadata.caseDetail.caseDetailInternalTabs,
    primaryTab: state.currentViewMetadata.caseDetail.primaryTab,
    showEditPetition: state.currentViewMetadata.caseDetail.showEditPetition,
    showModal: state.modal.showModal,
  },
  function CaseDetailInternal({
    caseDetailInternalTabs,
    showEditPetition,
    showModal,
  }) {
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

          {caseDetailInternalTabs.docketRecord && (
            <Tabs
              bind="currentViewMetadata.caseDetail.docketRecordTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-docket-sub-record"
                tabName="docketRecord"
                title="Docket Record"
              >
                <DocketRecord />
              </Tab>
              <Tab
                id="tab-document-view"
                tabName="documentView"
                title="Document View"
              >
                {/* TODO <DocumentView /> */}
              </Tab>
            </Tabs>
          )}
          {caseDetailInternalTabs.trackedItems && (
            <Tabs
              bind="currentViewMetadata.caseDetail.trackedItemsTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-deadlines" tabName="deadlines" title="Deadlines">
                <CaseDeadlinesInternal />
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
          {caseDetailInternalTabs.drafts && (
            <>
              <div className="title">
                <h1>Draft Documents</h1>
              </div>
              <DraftDocuments />
            </>
          )}
          {caseDetailInternalTabs.messages && (
            <Tabs
              bind="currentViewMetadata.caseDetail.messagesTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-messages-in-progress"
                tabName="messagesInProgress"
                title="In Progress"
              >
                <CaseMessagesInProgress />
              </Tab>
              <Tab
                id="tab-messages-completed"
                tabName="messagesCompleted"
                title="Completed"
              >
                <CaseMessagesCompleted />
              </Tab>
            </Tabs>
          )}
          {caseDetailInternalTabs.correspondence && (
            <>
              <Correspondence />
            </>
          )}
          {caseDetailInternalTabs.caseInformation && showEditPetition && (
            <EditPetitionDetails />
          )}
          {caseDetailInternalTabs.caseInformation && !showEditPetition && (
            <Tabs
              bind="currentViewMetadata.caseDetail.caseInformationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-overview" tabName="overview" title="Overview">
                <CaseInformationInternal />
              </Tab>
              <Tab id="tab-statistics" tabName="statistics" title="Statistics">
                <Statistics />
              </Tab>
              <Tab id="tab-petitioner" tabName="petitioner" title="Petitioner">
                <PetitionerInformation />
              </Tab>
              <Tab id="tab-respondent" tabName="respondent" title="Respondent">
                <RespondentInformation />
              </Tab>
              <Tab id="tab-other-filer" tabName="otherFiler" title="Other">
                <OtherFilerInformation />
              </Tab>
            </Tabs>
          )}
          {caseDetailInternalTabs.notes && (
            <>
              <div className="title">
                <h1>Notes</h1>
              </div>
              <CaseNotes />
            </>
          )}
        </section>

        {showModal === 'PaperServiceConfirmModal' && (
          <PaperServiceConfirmModal />
        )}
        {showModal === 'SealCaseModal' && <SealCaseModal />}
      </>
    );
  },
);

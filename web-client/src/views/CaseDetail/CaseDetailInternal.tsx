import { CaseDeadlinesInternal } from './CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailPendingReportList } from './CaseDetailPendingReportList';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationInternal } from './CaseInformation/CaseInformationInternal';
import { CaseNotes } from './CaseNotes';
import { CaseStatusHistory } from './CaseStatusHistory';
import { Correspondence } from '../Correspondence/Correspondence';
import { DocketRecord } from '../DocketRecord/DocketRecord';
import { DocumentViewer } from '../DocketRecord/DocumentViewer';
import { DraftDocuments } from '../DraftDocuments/DraftDocuments';
import { EditCaseDetails } from './EditCaseDetails';
import { ErrorNotification } from '../ErrorNotification';
import { MessagesCompleted } from './MessagesCompleted';
import { MessagesInProgress } from './MessagesInProgress';
import { PaperServiceConfirmModal } from './PaperServiceConfirmModal';
import { PartiesInformation } from './PartiesInformation';
import { SealAddressModal } from './SealAddressModal';
import { SealCaseModal } from './SealCaseModal';
import { Statistics } from './Statistics';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { UnsealCaseModal } from './UnsealCaseModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';

export const CaseDetailInternal = connect(
  {
    caseDetailInternalTabs:
      state.currentViewMetadata.caseDetail.caseDetailInternalTabs,
    clearViewerDocumentToDisplaySequence:
      sequences.clearViewerDocumentToDisplaySequence,
    showEditCase: state.currentViewMetadata.caseDetail.showEditCase,
    showModal: state.modal.showModal,
  },
  function CaseDetailInternal({
    caseDetailInternalTabs,
    clearViewerDocumentToDisplaySequence,
    showEditCase,
    showModal,
  }) {
    useEffect(() => {
      return () => clearViewerDocumentToDisplaySequence();
    }, []);

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
                <DocumentViewer />
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
                <h1>Drafts</h1>
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
                <MessagesInProgress />
              </Tab>
              <Tab
                id="tab-messages-completed"
                tabName="messagesCompleted"
                title="Completed"
              >
                <MessagesCompleted />
              </Tab>
            </Tabs>
          )}
          {caseDetailInternalTabs.correspondence && (
            <>
              <Correspondence />
            </>
          )}
          {caseDetailInternalTabs.caseInformation && showEditCase && (
            <EditCaseDetails />
          )}
          {caseDetailInternalTabs.caseInformation && !showEditCase && (
            <Tabs
              bind="currentViewMetadata.caseDetail.caseInformationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-overview" tabName="overview" title="Overview">
                <CaseInformationInternal />
              </Tab>
              <Tab
                data-testid="tab-parties"
                id="tab-parties"
                tabName="parties"
                title="Parties"
              >
                <PartiesInformation />
              </Tab>
              <Tab id="tab-statistics" tabName="statistics" title="Statistics">
                <Statistics />
              </Tab>
              <Tab id="tab-history" tabName="history" title="History">
                <CaseStatusHistory />
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
        {showModal === 'SealAddressModal' && <SealAddressModal />}
        {showModal === 'UnsealCaseModal' && <UnsealCaseModal />}
      </>
    );
  },
);

CaseDetailInternal.displayName = 'CaseDetailInternal';

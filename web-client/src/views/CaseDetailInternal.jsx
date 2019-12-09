import { AddToTrialModal } from './CaseDetail/AddToTrialModal';
import { BlockFromTrialModal } from './CaseDetail/BlockFromTrialModal';
import { CaseDeadlinesInternal } from './CaseDetail/CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailPendingReportList } from './CaseDetail/CaseDetailPendingReportList';
import { CaseInformationInternal } from './CaseDetail/CaseInformationInternal';
import { CaseNotes } from './CaseDetail/CaseNotes';
import { CreateCaseDeadlineModalDialog } from './CaseDetail/CreateCaseDeadlineModalDialog';
import { DeleteCaseDeadlineModalDialog } from './CaseDetail/DeleteCaseDeadlineModalDialog';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { DraftDocuments } from './DraftDocuments/DraftDocuments';
import { EditCaseDeadlineModalDialog } from './CaseDetail/EditCaseDeadlineModalDialog';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessagesInProgress } from './CaseDetail/MessagesInProgress';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { PrioritizeCaseModal } from './CaseDetail/PrioritizeCaseModal';
import { RemoveFromTrialSessionModal } from './CaseDetail/RemoveFromTrialSessionModal';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { UnblockFromTrialModal } from './CaseDetail/UnblockFromTrialModal';
import { UnprioritizeCaseModal } from './CaseDetail/UnprioritizeCaseModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    pdfPreviewUrl: state.anotherPdfPreviewUrl,
    setCaseDetailPageTabSequence: sequences.setCaseDetailPageTabSequence,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    caseDetailHelper,
    formattedCaseDetail,
    pdfPreviewUrl,
    setCaseDetailPageTabSequence,
    showModal,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <SuccessNotification />
          <ErrorNotification />
          <Tabs
            bind="caseDetailPage.deadlinesTab"
            className="classic-horizontal-header3 tab-border"
          >
            <Tab
              id="tab-case-deadlines"
              tabName="caseDeadlines"
              title="Deadlines"
            >
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

          <div>
            <div className="title">
              <h1>Messages in Progress</h1>
            </div>
            <MessagesInProgress />
          </div>
          <div className="only-small-screens">
            <div className="margin-bottom-3">
              <select
                aria-label="additional case info"
                className="usa-select"
                id="mobile-document-detail-tab-selector"
                name="partyType"
                value={caseDetailHelper.documentDetailTab}
                onChange={e => {
                  setCaseDetailPageTabSequence({
                    tab: e.target.value,
                  });
                }}
              >
                <option value="docketRecord">Docket Record</option>
                <option value="caseInfo">Case Information</option>
              </select>
            </div>
          </div>
          <div className="mobile-document-detail-tabs">
            <Tabs
              bind="caseDetailPage.informationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-docket-record"
                tabName="docketRecord"
                title="Docket Record"
              >
                <DocketRecord />
              </Tab>
              <Tab
                id="tab-draft-documents"
                tabName="draftDocuments"
                title="Draft Documents"
              >
                <DraftDocuments />
              </Tab>
              <Tab
                id="tab-case-info"
                tabName="caseInfo"
                title="Case Information"
              >
                <CaseInformationInternal />
                <div className="case-detail-party-info">
                  <PartyInformation />
                </div>
              </Tab>
              {caseDetailHelper.showCaseNotes && (
                <Tab id="tab-case-notes" tabName="caseNotes" title="Notes">
                  <CaseNotes />
                </Tab>
              )}
            </Tabs>
          </div>
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
        {showModal === 'AddToTrialModal' && <AddToTrialModal />}
        {showModal === 'BlockFromTrialModal' && <BlockFromTrialModal />}
        {showModal === 'UnblockFromTrialModal' && <UnblockFromTrialModal />}
        {showModal === 'PrioritizeCaseModal' && <PrioritizeCaseModal />}
        {showModal === 'UnprioritizeCaseModal' && <UnprioritizeCaseModal />}
        {showModal === 'RemoveFromTrialSessionModal' && (
          <RemoveFromTrialSessionModal />
        )}
        <iframe
          id="pdf-preview-iframe"
          src={pdfPreviewUrl}
          title="PDF Preview"
        />
      </>
    );
  },
);

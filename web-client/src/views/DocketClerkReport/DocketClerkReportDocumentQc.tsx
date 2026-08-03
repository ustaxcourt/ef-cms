import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { FormattedWorkItemWithCaseInfo } from '@web-client/presenter/computeds/formattedWorkQueue';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const DocketClerkReportWorkItemTable = ({
  ariaLabelId,
  emptyText,
  id,
  showStatusIcon = false,
  workItems,
}: {
  ariaLabelId: string;
  emptyText: string;
  id: string;
  showStatusIcon?: boolean;
  workItems: FormattedWorkItemWithCaseInfo[];
}) => {
  return (
    <>
      <div className="text-right">
        <span className="text-semibold">Count: </span>
        {workItems.length}
      </div>
      <div className="padding-1"></div>
      <table
        aria-describedby={ariaLabelId}
        className="usa-table ustc-table subsection"
        id={id}
      >
        <thead>
          <tr>
            <th aria-hidden="true" className="consolidated-case-column"></th>
            <th aria-label="Docket Number" className="small">
              <span className="padding-left-2px">Docket No.</span>
            </th>
            <th className="small">Received</th>
            <th>Case Title</th>
            {showStatusIcon && (
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
            )}
            <th>Document</th>
            <th>Filed By</th>
            <th>Case Status</th>
          </tr>
        </thead>
        <tbody>
          {workItems.map(item => (
            <tr key={item.workItemId}>
              <td className="consolidated-case-column">
                {item.groupedMemberCases ? (
                  <div className="consolidated-icons-stack" aria-hidden="true">
                    <ConsolidatedCaseIcon
                      consolidatedIconTooltipText={
                        item.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={item.inConsolidatedGroup}
                      showLeadCaseIcon={item.inLeadCase}
                    />
                    {item.groupedMemberCases.map(c => (
                      <ConsolidatedCaseIcon
                        key={`icon-${c.docketNumber}`}
                        consolidatedIconTooltipText={
                          c.inLeadCase ? 'Lead case' : 'Consolidated case'
                        }
                        inConsolidatedGroup={true}
                        showLeadCaseIcon={c.inLeadCase}
                      />
                    ))}
                  </div>
                ) : (
                  <ConsolidatedCaseIcon
                    consolidatedIconTooltipText={
                      item.consolidatedIconTooltipText
                    }
                    inConsolidatedGroup={item.inConsolidatedGroup}
                    showLeadCaseIcon={item.inLeadCase}
                  />
                )}
              </td>
              <td
                className="message-queue-row small"
                data-testid={`docket-clerk-report-docket-number-${item.docketNumber}`}
              >
                {item.groupedMemberCases ? (
                  <div className="grouped-cases-row">
                    <CaseLink formattedCase={item} />
                    <div className="member-case-links">
                      {item.groupedMemberCases.map(c => (
                        <div key={c.docketNumber} className="member-case-line">
                          <CaseLink formattedCase={c} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <CaseLink formattedCase={item} />
                )}
              </td>
              <td className="message-queue-row small">
                <span className="no-wrap">{item.received}</span>
              </td>
              <td className="message-queue-row message-queue-case-title">
                {item.caseTitle}
              </td>
              {showStatusIcon && (
                <td className="message-queue-row has-icon padding-right-0">
                  {item.showUnreadStatusIcon && (
                    <Icon
                      aria-label="Unread message"
                      className="iconStatusUnread"
                      icon={['fas', 'envelope']}
                      size="lg"
                    />
                  )}
                  {item.showHighPriorityIcon && (
                    <Icon
                      aria-label="High priority"
                      className="iconHighPriority"
                      icon={['fas', 'exclamation-circle']}
                      size="lg"
                    />
                  )}
                </td>
              )}
              <td className="message-queue-row max-width-25">
                <div className="message-document-title">
                  {item.editLink ? (
                    <a className="case-link" href={item.editLink}>
                      {item.docketEntry.descriptionDisplay ||
                        item.docketEntry.documentType}
                    </a>
                  ) : (
                    <span>
                      {item.docketEntry.descriptionDisplay ||
                        item.docketEntry.documentType}
                    </span>
                  )}
                </div>
              </td>
              <td className="message-queue-row">{item.docketEntry.filedBy}</td>
              <td className="message-queue-row">{item.formattedCaseStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {workItems.length === 0 && <p>{emptyText}</p>}
    </>
  );
};

const docketClerkReportDocumentQcDeps = {
  documentQc: state.docketClerkReportDocumentQcHelper,
};

export const DocketClerkReportDocumentQc = connect(
  docketClerkReportDocumentQcDeps,
  function DocketClerkReportDocumentQc({
    documentQc,
  }: {
    documentQc: {
      inbox: FormattedWorkItemWithCaseInfo[];
      inProgress: FormattedWorkItemWithCaseInfo[];
      processed: FormattedWorkItemWithCaseInfo[];
    };
  }) {
    return (
      <Tabs bind="docketClerkReport.box" defaultActiveTab="inbox" id="qc-tabs">
        <Tab
          data-testid="docket-clerk-report-qc-inbox-tab"
          tabName="inbox"
          title={`Inbox (${documentQc.inbox.length})`}
        >
          <DocketClerkReportWorkItemTable
            ariaLabelId="qc-tabs"
            emptyText="There are no documents."
            id="docket-clerk-report-qc-inbox"
            showStatusIcon={true}
            workItems={documentQc.inbox}
          />
        </Tab>
        <Tab
          data-testid="docket-clerk-report-qc-in-progress-tab"
          tabName="inProgress"
          title={`In Progress (${documentQc.inProgress.length})`}
        >
          <DocketClerkReportWorkItemTable
            ariaLabelId="qc-tabs"
            emptyText="There are no documents."
            id="docket-clerk-report-qc-in-progress"
            workItems={documentQc.inProgress}
          />
        </Tab>
        <Tab
          data-testid="docket-clerk-report-qc-processed-tab"
          tabName="processed"
          title={`Processed`}
        >
          <DocketClerkReportWorkItemTable
            ariaLabelId="qc-tabs"
            emptyText="There are no documents."
            id="docket-clerk-report-qc-processed"
            workItems={documentQc.processed}
          />
        </Tab>
      </Tabs>
    );
  },
);

DocketClerkReportDocumentQc.displayName = 'DocketClerkReportDocumentQc';

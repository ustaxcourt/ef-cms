import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueOutbox({
    formattedWorkQueue,
    users,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        <WorkQueueAssignments users={users} count={formattedWorkQueue.length} />
        <table
          aria-describedby="tab-work-queue"
          className="usa-table ustc-table subsection"
          data-testid="section-work-queue-in-outbox"
          id="section-work-queue"
        >
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Case title</th>
              <th>Document</th>
              {workQueueHelper.showFiledByColumn && <th>Filed By</th>}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && <th>Assigned To</th>}
              <th>{workQueueHelper.sentTitle} By</th>
              <th>{workQueueHelper.sentTitle} Date</th>
            </tr>
          </thead>
          <tbody>
            {formattedWorkQueue.map(item => (
              <tr
                key={item.workItemId}
                data-testid={`work-item-section-outbox-${item.docketNumber}`}
              >
                <td className="consolidated-case-column">
                  {item.groupedCases ? (
                    <div
                      className="consolidated-icons-stack"
                      aria-hidden="true"
                    >
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          item.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={item.inConsolidatedGroup}
                        showLeadCaseIcon={item.inLeadCase}
                      />
                      {item.groupedCases
                        .filter(c => c.docketNumber !== item.docketNumber)
                        .map(c => (
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
                <td className="message-queue-row">
                  {item.groupedCases ? (
                    <div className="grouped-cases-row">
                      <div className="member-case-links">
                        {item.groupedCases.map(c => (
                          <div
                            key={c.docketNumber}
                            className="member-case-line"
                          >
                            <CaseLink formattedCase={c} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <CaseLink formattedCase={item} />
                  )}
                </td>
                <td className="message-queue-row message-queue-case-title">
                  {item.caseTitle}
                </td>
                <td className="message-queue-row">
                  <div className="message-document-title">
                    {item.editLink ? (
                      <a className="case-link" href={item.editLink}>
                        {(item.docketEntry &&
                          item.docketEntry.descriptionDisplay) ||
                          (item.docketEntry && item.docketEntry.documentType)}
                      </a>
                    ) : (
                      <span>
                        {(item.docketEntry &&
                          item.docketEntry.descriptionDisplay) ||
                          (item.docketEntry && item.docketEntry.documentType)}
                      </span>
                    )}
                  </div>
                </td>
                {workQueueHelper.showFiledByColumn && (
                  <td className="message-queue-row">
                    {item.docketEntry.filedBy}
                  </td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">
                    {item.formattedCaseStatus}
                  </td>
                )}
                <td className="message-queue-row">{item.completedBy}</td>
                <td className="message-queue-row">
                  {item.completedAtFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueOutbox.displayName = 'SectionWorkQueueOutbox';

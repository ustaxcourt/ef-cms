import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    outboxHelper: state.consolidateWorkQueueItemsOutboxHelper,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueOutbox({ outboxHelper, users, workQueueHelper }) {
    const { consolidatedWorkItems } = outboxHelper;

    return (
      <React.Fragment>
        <WorkQueueAssignments
          users={users}
          count={consolidatedWorkItems.length}
        />
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
            {consolidatedWorkItems.map(workItem => (
              <tr
                key={workItem.key}
                data-testid={`work-item-section-outbox-${workItem.groupLead}-${workItem.docGroup.key}`}
              >
                <td className="consolidated-case-column">
                  {workItem.memberCasesUnique.length > 1 ? (
                    <div
                      className="consolidated-icons-stack"
                      aria-hidden="true"
                    >
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          workItem.leadItemForIcons.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={
                          workItem.leadItemForIcons.inConsolidatedGroup
                        }
                        showLeadCaseIcon={
                          workItem.leadItemForIcons.leadDocketNumber ===
                          workItem.leadItemForIcons.docketNumber
                        }
                      />
                      {outboxHelper
                        .sortMemberCases(workItem.memberCasesUnique)
                        .filter(
                          c =>
                            c.docketNumber !==
                            workItem.leadItemForIcons.docketNumber,
                        )
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
                        workItem.leadItemForIcons.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={
                        workItem.leadItemForIcons.inConsolidatedGroup
                      }
                      showLeadCaseIcon={
                        workItem.leadItemForIcons.leadDocketNumber ===
                        workItem.leadItemForIcons.docketNumber
                      }
                    />
                  )}
                </td>
                <td className="message-queue-row">
                  {workItem.memberCasesUnique.length > 1 ? (
                    <div className="grouped-cases-row">
                      <div className="member-case-links">
                        {outboxHelper
                          .sortMemberCases(workItem.memberCasesUnique)
                          .map(c => (
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
                    <CaseLink formattedCase={workItem.leadItemForIcons} />
                  )}
                </td>
                <td className="message-queue-row message-queue-case-title">
                  {workItem.leadItemForIcons.caseTitle}
                </td>
                <td className="message-queue-row">
                  <div className="message-document-title">
                    {workItem.leadItemForIcons.editLink ? (
                      <a
                        className="case-link"
                        href={workItem.leadItemForIcons.editLink}
                      >
                        {(workItem.leadItemForIcons.docketEntry &&
                          workItem.leadItemForIcons.docketEntry
                            .descriptionDisplay) ||
                          (workItem.leadItemForIcons.docketEntry &&
                            workItem.leadItemForIcons.docketEntry.documentType)}
                      </a>
                    ) : (
                      <span>
                        {(workItem.leadItemForIcons.docketEntry &&
                          workItem.leadItemForIcons.docketEntry
                            .descriptionDisplay) ||
                          (workItem.leadItemForIcons.docketEntry &&
                            workItem.leadItemForIcons.docketEntry.documentType)}
                      </span>
                    )}
                  </div>
                </td>
                {workQueueHelper.showFiledByColumn && (
                  <td className="message-queue-row">
                    {workItem.representative.docketEntry.filedBy}
                  </td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">
                    {workItem.representative.formattedCaseStatus}
                  </td>
                )}
                <td className="message-queue-row">
                  {workItem.representative.completedBy}
                </td>
                <td className="message-queue-row">
                  {workItem.representative.completedAtFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consolidatedWorkItems.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueOutbox.displayName = 'SectionWorkQueueOutbox';

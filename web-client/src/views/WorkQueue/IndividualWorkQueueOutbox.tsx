import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';

export const IndividualWorkQueueOutbox = connect(
  {
    outboxHelper: state.consolidateWorkQueueItemsOutboxHelper,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueOutbox({ outboxHelper, workQueueHelper }) {
    const rowsCount = outboxHelper.outboxRenderedRowCount || 0;
    const { consolidatedWorkItems } = outboxHelper;

    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {rowsCount}
        </div>
        <div className="padding-1"></div>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table ustc-table subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="small">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Case Title</th>
              <th>Document</th>
              {workQueueHelper.showFiledByColumn && (
                <th>{workQueueHelper.outboxFiledByColumnLabel} By</th>
              )}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && (
                <th className="max-width-7">Assigned To</th>
              )}
              <th>{workQueueHelper.sentTitle} Date</th>
            </tr>
          </thead>
          <tbody>
            {consolidatedWorkItems.map(workItem => {
              const item = workItem.representative;

              return (
                <tr
                  key={workItem.key}
                  data-testid={`work-item-outbox-row-${workItem.groupLead}-${workItem.docGroup.key}`}
                >
                  <td className="consolidated-case-column">
                    {workItem.memberCasesUnique.length > 1 ? (
                      <div
                        className="consolidated-icons-stack"
                        aria-hidden="true"
                      >
                        <ConsolidatedCaseIcon
                          consolidatedIconTooltipText={
                            workItem.leadItemForIcons
                              .consolidatedIconTooltipText
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
                  <td className="message-queue-row small">
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
                  <td className="message-queue-row message-queue-document">
                    <div className="message-document-title">
                      {workItem.leadItemForIcons.editLink ? (
                        <a
                          className="case-link"
                          data-testid="work-item-outbox-document-link"
                          href={workItem.leadItemForIcons.editLink}
                        >
                          {(workItem.leadItemForIcons.docketEntry &&
                            workItem.leadItemForIcons.docketEntry
                              .descriptionDisplay) ||
                            (workItem.leadItemForIcons.docketEntry &&
                              workItem.leadItemForIcons.docketEntry
                                .documentType)}
                        </a>
                      ) : (
                        <span>
                          {(workItem.leadItemForIcons.docketEntry &&
                            workItem.leadItemForIcons.docketEntry
                              .descriptionDisplay) ||
                            (workItem.leadItemForIcons.docketEntry &&
                              workItem.leadItemForIcons.docketEntry
                                .documentType)}
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
                  <td className="message-queue-row">
                    {item.completedAtFormatted}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {consolidatedWorkItems.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

IndividualWorkQueueOutbox.displayName = 'IndividualWorkQueueOutbox';

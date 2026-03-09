import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const IndividualWorkQueueInbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueInbox({ formattedWorkQueue, workQueueHelper }) {
    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {formattedWorkQueue.length}
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
              <th className="small">Received</th>
              <th>Case Title</th>
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
              <th>Document</th>
              {workQueueHelper.showFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
            </tr>
          </thead>
          <tbody>
            {formattedWorkQueue.map(item => {
              return (
                <tr key={item.workItemId}>
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
                  <td
                    className="message-queue-row small"
                    data-testid={`message-queue-docket-number-${item.docketNumber}`}
                  >
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
                  <td className="message-queue-row small">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row message-queue-case-title">
                    {item.caseTitle}
                  </td>
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
                  <td className="message-queue-row max-width-25">
                    <div className="message-document-title">
                      {item.editLink ? (
                        <a
                          className={
                            item.isRead ? 'case-link' : 'link case-link-bold'
                          }
                          href={item.editLink}
                        >
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
                  {workQueueHelper.showFiledByColumn && (
                    <td className="message-queue-row">
                      {item.docketEntry.filedBy}
                    </td>
                  )}
                  <td className="message-queue-row">
                    {item.formattedCaseStatus}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

IndividualWorkQueueInbox.displayName = 'IndividualWorkQueueInbox';

import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
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
        <WorkQueueAssignments showSendToBar={false} users={users} />
        <table
          aria-describedby="tab-work-queue"
          className="usa-table ustc-table subsection"
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
          {formattedWorkQueue.map(item => {
            return (
              <tbody key={item.workItemId}>
                <tr>
                  <td className="consolidated-case-column">
                    {item.inConsolidatedGroup && (
                      <span
                        className="fa-layers fa-fw"
                        title={item.consolidatedIconTooltipText}
                      >
                        <Icon
                          aria-label={item.consolidatedIconTooltipText}
                          className="fa-icon-blue"
                          icon="copy"
                        />
                        {item.inLeadCase && (
                          <span className="fa-inverse lead-case-icon-text">
                            L
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="message-queue-row">
                    <CaseLink formattedCase={item} />
                  </td>
                  <td className="message-queue-row message-queue-case-title">
                    {item.caseTitle}
                  </td>
                  <td className="message-queue-row">
                    <div className="message-document-title">
                      <a className="case-link" href={item.editLink}>
                        {item.docketEntry.descriptionDisplay ||
                          item.docketEntry.documentType}
                      </a>
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
                  {workQueueHelper.showAssignedToColumn && (
                    <td className="message-queue-row">
                      {item.currentMessage.to}
                    </td>
                  )}
                  <td className="message-queue-row">{item.completedBy}</td>
                  <td className="message-queue-row">
                    {item.completedAtFormatted}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueOutbox.displayName = 'SectionWorkQueueOutbox';

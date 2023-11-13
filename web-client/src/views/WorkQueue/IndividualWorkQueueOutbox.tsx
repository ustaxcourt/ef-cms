import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const IndividualWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueOutbox({ formattedWorkQueue, workQueueHelper }) {
    return (
      <React.Fragment>
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
          {formattedWorkQueue.map(item => (
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
                <td className="message-queue-row small">
                  <CaseLink formattedCase={item} />
                </td>
                <td className="message-queue-row message-queue-case-title">
                  {item.caseTitle}
                </td>
                <td className="message-queue-row message-queue-document">
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
                  <td className="to message-queue-row">
                    {item.currentMessage.to}
                  </td>
                )}
                <td className="message-queue-row">
                  {item.completedAtFormatted}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

IndividualWorkQueueOutbox.displayName = 'IndividualWorkQueueOutbox';

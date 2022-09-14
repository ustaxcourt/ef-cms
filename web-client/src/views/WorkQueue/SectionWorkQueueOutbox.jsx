import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueOutbox({ formattedWorkQueue, workQueueHelper }) {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-work-queue"
          className="usa-table ustc-table subsection"
          id="section-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Case title</th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && <th>Assigned To</th>}
              <th>{workQueueHelper.sentTitle} By</th>
              <th>{workQueueHelper.sentTitle} Date</th>
            </tr>
          </thead>
          {formattedWorkQueue.map(item => (
            <tbody key={item.workItemId}>
              <tr>
                <td aria-hidden="true" />
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
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">
                    {item.docketEntry.filedBy}
                  </td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">{item.caseStatus}</td>
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
          ))}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

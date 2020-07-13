import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInProgress = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueInProgress({
    formattedWorkQueue,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Received</th>
              <th>Case Title</th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              {workQueueHelper.showCaseStatusColumn && <th>Case Status</th>}
              {!workQueueHelper.hideFromColumn && <th>From</th>}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
              {workQueueHelper.showProcessedByColumn && <th>Processed By</th>}
            </tr>
          </thead>
          {formattedWorkQueue.map((item, idx) => {
            return (
              <tbody key={idx}>
                <tr>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row">
                    <CaseLink formattedCase={item} />
                  </td>
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row message-queue-case-title">
                    {item.caseTitle}
                  </td>
                  <td className="message-queue-row message-queue-document">
                    <div className="message-document-title">
                      <a
                        className="case-link"
                        href={item.editLink}
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        {item.document.documentTitle ||
                          item.document.documentType}
                      </a>
                    </div>
                    {workQueueHelper.showMessageContent && (
                      <div
                        className="message-document-detail"
                        id={`detail-${item.workItemId}`}
                      >
                        {item.currentMessage.message}
                      </div>
                    )}
                  </td>
                  {!workQueueHelper.hideFiledByColumn && (
                    <td className="message-queue-row">
                      {item.document.filedBy}
                    </td>
                  )}
                  {workQueueHelper.showCaseStatusColumn && (
                    <td className="message-queue-row">{item.caseStatus}</td>
                  )}
                  {!workQueueHelper.hideFromColumn && (
                    <td className="message-queue-row from">
                      {item.currentMessage.from}
                    </td>
                  )}
                  {!workQueueHelper.hideSectionColumn && (
                    <td className="message-queue-row">{item.sentBySection}</td>
                  )}
                  {workQueueHelper.showProcessedByColumn && (
                    <td>{item.assigneeName}</td>
                  )}
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedWorkQueue.length === 0 && (
          <p>{workQueueHelper.queueEmptyMessage}</p>
        )}
      </React.Fragment>
    );
  },
);

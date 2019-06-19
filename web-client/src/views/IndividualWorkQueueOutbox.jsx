import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    workQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({ documentHelper, workQueue, workQueueSectionHelper, workQueueHelper }) => {
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
                <span className="padding-left-2px">Docket</span>
              </th>
              {workQueueHelper.showReceivedColumn && <th>Received</th>}
              {workQueueHelper.showSentColumn && <th>Sent</th>}
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && (
                <th>{workQueueHelper.assigneeColumnTitle}</th>
              )}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
              {workQueueHelper.showServedColumn && <th>Served</th>}
            </tr>
          </thead>
          {workQueue.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                <td className="focus-toggle">
                  <button
                    aria-controls={`detail-${item.workItemId}`}
                    aria-expanded={item.isFocused}
                    aria-label="Expand message detail"
                    className="focus-button usa-button usa-button--unstyled"
                  />{' '}
                </td>
                <td className="message-queue-row">
                  <span className="no-wrap">{item.docketNumberWithSuffix}</span>
                </td>
                {workQueueHelper.showReceivedColumn && (
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                )}
                {workQueueHelper.showSentColumn && (
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.sentDateFormatted}</span>
                  </td>
                )}
                <td className="message-queue-row has-icon padding-right-0">
                  {item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      aria-hidden="false"
                      aria-label="batched for IRS"
                      className="iconStatusBatched"
                      icon={['far', 'clock']}
                      size="lg"
                    />
                  )}
                </td>
                <td className="message-queue-row">
                  <div className="message-document-title">
                    <a
                      className="case-link"
                      href={documentHelper({
                        docketNumber: item.docketNumber,
                        documentId: item.document.documentId,
                        messageId: item.currentMessage.messageId,
                        workItemIdToMarkAsRead: null,
                      })}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {item.document.documentType}
                    </a>
                  </div>
                  {workQueueHelper.showMessageContent && (
                    <div
                      className="message-document-detail"
                      id={`detail-${item.workItemId}`}
                    >
                      {item.completedMessage || item.currentMessage.message}
                    </div>
                  )}
                </td>
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">{item.document.filedBy}</td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">{item.caseStatus}</td>
                )}
                {workQueueHelper.showAssignedToColumn && (
                  <td className="to message-queue-row">
                    {item.currentMessage.to}
                  </td>
                )}
                {!workQueueHelper.hideSectionColumn && (
                  <td className="message-queue-row">
                    {workQueueSectionHelper.sectionDisplay(item.section)}
                  </td>
                )}
                {workQueueHelper.showServedColumn && (
                  <td className="message-queue-row">{item.received}</td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    documentHelper,
    sectionWorkQueue,
    workQueueSectionHelper,
    workQueueHelper,
  }) => {
    return (
      <table
        className="usa-table work-queue subsection"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
      >
        <thead>
          <tr>
            <th colSpan="2" aria-label="Docket Number">
              Docket
            </th>
            {workQueueHelper.showReceivedColumn && <th>Received</th>}
            {workQueueHelper.showSentColumn && <th>Sent</th>}
            <th aria-label="Status Icon" className="padding-right-0" />
            <th>Document</th>
            {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
            {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
            {workQueueHelper.showMessagesSentFromColumn && <th>From</th>}
            {workQueueHelper.showAssignedToColumn && (
              <th>{workQueueHelper.assigneeColumnTitle}</th>
            )}
            {workQueueHelper.showProcessedByColumn && <th>Processed By</th>}
            {!workQueueHelper.hideSectionColumn && <th>Section</th>}
            {workQueueHelper.showServedColumn && <th>Served</th>}
          </tr>
        </thead>
        {sectionWorkQueue.map((item, idx) => (
          <tbody key={idx}>
            <tr>
              <td className="focus-toggle">
                <button
                  className="focus-button usa-button usa-button--unstyled"
                  aria-label="Expand message detail"
                  aria-expanded={item.isFocused}
                  aria-controls={`detail-${item.workItemId}`}
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
                    icon={['far', 'clock']}
                    className="iconStatusBatched"
                    aria-hidden="true"
                    size="lg"
                  />
                )}
              </td>

              <td className="message-queue-row">
                <div className="message-document-title">
                  <a
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    href={documentHelper({
                      docketNumber: item.docketNumber,
                      documentId: item.document.documentId,
                    })}
                    className="case-link"
                  >
                    {item.document.documentType}
                  </a>
                </div>
                {workQueueHelper.showMessageContent && (
                  <div
                    id={`detail-${item.workItemId}`}
                    className="message-document-detail"
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
              {workQueueHelper.showMessagesSentFromColumn && (
                <td className="message-queue-row">{item.assigneeName}</td>
              )}
              {workQueueHelper.showAssignedToColumn && (
                <td className="message-queue-row">
                  {item.currentMessage.from}
                </td>
              )}
              {workQueueHelper.showProcessedByColumn && (
                <td className="message-queue-row">{item.completedBy}</td>
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
    );
  },
);

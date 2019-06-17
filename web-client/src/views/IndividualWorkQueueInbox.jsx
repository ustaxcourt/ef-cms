import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInbox = connect(
  {
    documentHelper: state.documentHelper,
    workQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ workQueue, workQueueHelper, documentHelper }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table work-queue subsection"
          id="my-work-queue"
          aria-describedby="tab-my-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                Docket
              </th>
              <th>Received</th>
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
              {!workQueueHelper.hideFromColumn && <th>From</th>}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
            </tr>
          </thead>
          {workQueue.map((item, idx) => {
            const workItemUnread =
              item.showUnreadStatusIcon && item.showUnreadIndicators;
            return (
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
                    <span className="no-wrap">
                      {item.docketNumberWithSuffix}
                    </span>
                  </td>
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row has-icon padding-right-0">
                    {item.showBatchedStatusIcon && (
                      <FontAwesomeIcon
                        icon={['far', 'clock']}
                        className="iconStatusBatched"
                        aria-label="batched for IRS"
                        aria-hidden="false"
                        size="lg"
                      />
                    )}
                    {item.showRecalledStatusIcon && (
                      <FontAwesomeIcon
                        icon={['far', 'clock']}
                        className="iconStatusRecalled"
                        aria-label="recalled from IRS"
                        aria-hidden="false"
                        size="lg"
                      />
                    )}
                    {item.showUnreadStatusIcon && (
                      <FontAwesomeIcon
                        icon={['fas', 'envelope']}
                        className="iconStatusUnread"
                        aria-label="unread message"
                        size="lg"
                        aria-hidden="false"
                      />
                    )}
                  </td>
                  <td className="message-queue-row message-queue-document">
                    <div className="message-document-title">
                      <a
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        href={documentHelper({
                          docketNumber: item.docketNumber,
                          documentId: item.document.documentId,
                          messageId: item.currentMessage.messageId,
                          workItemIdToMarkAsRead: workItemUnread
                            ? item.workItemId
                            : null,
                        })}
                        className={
                          item.isRead ? 'case-link' : 'link case-link-bold'
                        }
                      >
                        {item.document.documentType}
                      </a>
                    </div>
                    {workQueueHelper.showMessageContent && (
                      <div
                        id={`detail-${item.workItemId}`}
                        className="message-document-detail"
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
                  <td className="message-queue-row">{item.caseStatus}</td>
                  {!workQueueHelper.hideFromColumn && (
                    <td className="message-queue-row from">
                      {item.currentMessage.from}
                    </td>
                  )}
                  {!workQueueHelper.hideSectionColumn && (
                    <td className="message-queue-row">{item.sentBySection}</td>
                  )}
                </tr>
              </tbody>
            );
          })}
        </table>
      </React.Fragment>
    );
  },
);

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInbox = connect(
  {
    documentHelper: state.documentHelper,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    workQueue: state.formattedWorkQueue,
  },
  ({ setFocusedWorkItem, workQueue, documentHelper }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table work-queue subsection"
          id="my-work-queue"
          aria-describedby="tab-my-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number">Docket</th>
              <th>Received</th>
              <th aria-label="Status Icon">&nbsp;</th>
              <th>Document</th>
              <th>Status</th>
              <th>From</th>
              <th>Section</th>
            </tr>
          </thead>
          {workQueue.map((item, idx) => (
            <tbody
              key={idx}
              onClick={() =>
                setFocusedWorkItem({
                  queueType: 'workQueue',
                  uiKey: item.uiKey,
                })
              }
            >
              <tr>
                <td className="message-queue-row">
                  {item.docketNumberWithSuffix}
                </td>
                <td className="message-queue-row">
                  {item.currentMessage.createdAtFormatted}
                </td>
                <td className="message-queue-row has-icon">
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
                      })}
                      className={
                        item.isRead ? 'case-link' : 'link case-link-bold'
                      }
                    >
                      {item.document.documentType}
                    </a>
                  </div>
                  <div className="message-document-detail">
                    {item.currentMessage.message}
                  </div>
                </td>
                <td className="message-queue-row">{item.caseStatus}</td>
                <td className="message-queue-row from">
                  {item.currentMessage.from}
                </td>
                <td className="message-queue-row">{item.sentBySection}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);

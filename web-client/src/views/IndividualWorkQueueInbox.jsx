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
              <th aria-hidden="true">&nbsp;</th>
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
                <td className="focus-toggle">
                  <button
                    className="focus-button"
                    aria-label="Expand message detail"
                    aria-expanded={item.isFocused}
                    aria-controls={`detail-${item.workItemId}`}
                  />
                </td>
                <td>{item.docketNumberWithSuffix}</td>
                <td>{item.currentMessage.createdAtFormatted}</td>
                <td className="has-icon">
                  {item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      icon={['far', 'clock']}
                      className={item.statusIcon}
                      aria-hidden="true"
                      size="lg"
                    />
                  )}
                  {!item.readAt && !item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      icon={['fas', 'envelope']}
                      className={`${item.statusIcon} iconStatusUnread`}
                      aria-hidden="true"
                      size="lg"
                    />
                  )}
                </td>
                <td>
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
                      item.readAt ? 'case-link' : 'link case-link-bold'
                    }
                  >
                    {item.document.documentType}
                  </a>
                </td>
                <td>{item.caseStatus}</td>
                <td className="from">{item.currentMessage.from}</td>
                <td>{item.sentBySection}</td>
              </tr>
              {item.isFocused && (
                <tr className="queue-message">
                  <td className="focus-toggle">
                    <button
                      className="focus-button"
                      tabIndex="-1"
                      aria-disabled="true"
                    />
                  </td>
                  <td colSpan="3" aria-hidden="true" />
                  <td
                    colSpan="5"
                    className="message-detail"
                    aria-label="Message detail"
                    aria-live="polite"
                    id={`detail-${item.workItemId}`}
                  >
                    {item.currentMessage.message}
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);

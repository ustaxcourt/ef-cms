import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    workQueue: state.formattedWorkQueue,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    documentHelper,
    setFocusedWorkItem,
    workQueue,
    workQueueSectionHelper,
  }) => {
    return (
      <React.Fragment>
        <table
          className="work-queue subsection"
          id="my-work-queue"
          aria-describedby="tab-my-queue"
        >
          <thead>
            <tr>
              <th colSpan="2" aria-hidden="true">
                &nbsp;
              </th>
              <th aria-label="Docket Number">Docket</th>
              <th>Sent</th>
              <th>Document</th>
              <th>Status</th>
              <th>To</th>
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
                <td className="has-icon">
                  {item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      icon={['far', 'clock']}
                      className={item.statusIcon}
                      aria-hidden="true"
                    />
                  )}
                </td>
                <td>{item.docketNumberWithSuffix}</td>
                <td>{item.sentDateFormatted}</td>
                <td>
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
                </td>
                <td>{item.caseStatus}</td>
                <td>{item.assigneeName}</td>
                <td>{workQueueSectionHelper.sectionDisplay(item.section)}</td>
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
                    colSpan="3"
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

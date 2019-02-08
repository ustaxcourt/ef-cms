import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default connect(
  {
    sectionWorkQueue: state.formattedSectionWorkQueue,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
  },
  function SectionWorkQueueOutbox({ sectionWorkQueue, setFocusedWorkItem }) {
    return (
      <table
        className="work-queue"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
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
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        {sectionWorkQueue.map(item => (
          <tbody
            key={item.workItemId}
            onClick={() =>
              setFocusedWorkItem({
                workItemId: item.workItemId,
                queueType: 'workQueue',
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
                    aria-label={item.caseStatus}
                    title={item.caseStatus}
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
                  href={`/case-detail/${item.docketNumber}/documents/${
                    item.document.documentId
                  }`}
                  className="case-link"
                >
                  {item.document.documentType}
                </a>
              </td>
              <td>{item.caseStatus}</td>
              <td>{item.currentMessage.sentBy}</td>
              <td>{item.assigneeName}</td>
            </tr>
            {item.isFocused && (
              <tr className="queue-focus queue-message">
                <td className="focus-toggle">
                  <button
                    className="focus-button"
                    tabIndex="-1"
                    aria-disabled="true"
                  />
                </td>
                <td colSpan="3" aria-hidden="true" />
                <td
                  colSpan="4"
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
    );
  },
);

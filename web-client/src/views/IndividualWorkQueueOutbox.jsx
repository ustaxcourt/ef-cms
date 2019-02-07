import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default connect(
  {
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    workQueue: state.formattedWorkQueue,
  },
  function IndividualWorkQueue({ setFocusedWorkItem, workQueue }) {
    return (
      <React.Fragment>
        <table
          className="work-queue"
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
            </tr>
          </thead>
          {workQueue.map(item => (
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
                <td>
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
                <td>{item.assigneeName}</td>
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

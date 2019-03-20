import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueInbox = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectedWorkItems: state.selectedWorkItems,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  ({
    assignSelectedWorkItemsSequence,
    documentHelper,
    sectionWorkQueue,
    selectAssigneeSequence,
    selectedWorkItems,
    selectWorkItemSequence,
    setFocusedWorkItem,
    users,
    workQueueHelper,
  }) => {
    return (
      <table
        className="work-queue subsection"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
      >
        <thead>
          <tr>
            <th colSpan="3">Select</th>
            <th aria-label="Docket Number">Docket</th>
            <th>Received</th>
            <th>Document</th>
            <th>Status</th>
            <th>To</th>
            <th>From</th>
            <th>Section</th>
          </tr>
        </thead>
        {workQueueHelper.showSendToBar && (
          <tbody className="action-bar">
            <tr>
              <td
                colSpan="9"
                className="action-bar"
                aria-label="Action bar: choose an assignee."
                aria-live="polite"
              >
                <span className="selected-count">
                  {selectedWorkItems.length} selected
                </span>
                <label htmlFor="options">Send to</label>
                <select
                  onChange={event =>
                    selectAssigneeSequence({
                      assigneeId: event.target.value,
                      assigneeName:
                        event.target.options[event.target.selectedIndex].text,
                    })
                  }
                  name="options"
                  id="options"
                >
                  <option value>- Select -</option>
                  {users.map(user => (
                    <option key={user.userId} value={user.userId}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => assignSelectedWorkItemsSequence()}
                  className="usa-button"
                >
                  Send
                </button>
              </td>
            </tr>
          </tbody>
        )}
        {sectionWorkQueue.map((item, idx) => (
          <tbody
            key={idx}
            onClick={() =>
              setFocusedWorkItem({
                idx,
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
                />{' '}
              </td>
              <td className="has-icon">
                <input
                  id={item.workItemId}
                  type="checkbox"
                  onChange={e => {
                    selectWorkItemSequence({
                      workItem: item,
                    });
                    e.stopPropagation();
                  }}
                  checked={item.selected}
                  aria-label="Select work item"
                />
                <label
                  htmlFor={item.workItemId}
                  id={`label-${item.workItemId}`}
                />
              </td>
              <td className="section-queue-row has-icon">
                {item.showBatchedStatusIcon && (
                  <FontAwesomeIcon
                    icon={['far', 'clock']}
                    className={item.statusIcon}
                    aria-hidden="true"
                  />
                )}
              </td>
              <td className="section-queue-row">
                {item.docketNumberWithSuffix}
              </td>
              <td className="section-queue-row">
                {item.currentMessage.createdAtFormatted}
              </td>
              <td className="section-queue-row">
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
              <td className="section-queue-row">{item.caseStatus}</td>
              <td className="section-queue-row">{item.assigneeName}</td>
              <td className="section-queue-row">{item.currentMessage.from}</td>
              <td className="section-queue-row">{item.sentBySection}</td>
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
                <td colSpan="4" aria-hidden="true" />
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

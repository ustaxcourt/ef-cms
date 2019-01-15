import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';

export default connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    sectionWorkQueue: state.formattedSectionWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectedWorkItems: state.selectedWorkItems,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueue({
    assignSelectedWorkItemsSequence,
    sectionWorkQueue,
    selectAssigneeSequence,
    selectedWorkItems,
    selectWorkItemSequence,
    setFocusedWorkItem,
    users,
    workQueueHelper,
  }) {
    return (
      <table
        className="work-queue"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
      >
        <thead>
          <tr>
            <th colSpan="2">Select</th>
            <th aria-label="Docket Number">Docket</th>
            <th>Received</th>
            <th>Document</th>
            <th>Status</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        {workQueueHelper.showSendToBar && (
          <tbody className="action-bar">
            <tr>
              <td
                colSpan="8"
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
        {sectionWorkQueue.map(item => (
          <tbody
            key={item.workItemId}
            onClick={() =>
              setFocusedWorkItem({
                workItemId: item.workItemId,
                queueType: 'sectionWorkQueue',
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
              <td>
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
              <td>{item.docketNumber}</td>
              <td>{item.currentMessage.createdAtFormatted}</td>
              <td>
                <a
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

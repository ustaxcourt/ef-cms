import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueInbox = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    documentHelper: state.documentHelper,
    navigateToPathSequence: sequences.navigateToPathSequence,
    sectionWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    selectedWorkItems: state.selectedWorkItems,
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
    navigateToPathSequence,
  }) => {
    return (
      <React.Fragment>
        {workQueueHelper.showSendToBar && (
          <div className="action-section">
            <span
              className="assign-work-item-count"
              aria-label="selected work items count"
            >
              <FontAwesomeIcon icon="check" />
              {selectedWorkItems.length}
            </span>
            <select
              aria-label="select a assignee"
              className="usa-select"
              onChange={event => {
                selectAssigneeSequence({
                  assigneeId: event.target.value,
                  assigneeName:
                    event.target.options[event.target.selectedIndex].text,
                });
                assignSelectedWorkItemsSequence();
              }}
              name="options"
              id="options"
            >
              <option value>Assign to...</option>
              {users.map(user => (
                <option key={user.userId} value={user.userId}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <table
          className="usa-table work-queue subsection"
          id="section-work-queue"
          aria-describedby="tab-work-queue"
        >
          <thead>
            <tr>
              <th colSpan="2">Select</th>
              <th aria-label="Docket Number">Docket</th>
              <th>Received</th>
              <th />
              <th>Document</th>
              <th>Case Status</th>
              <th>{workQueueHelper.assigneeColumnTitle}</th>
              {!workQueueHelper.hideFromColumn && <th>From</th>}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
            </tr>
          </thead>
          {sectionWorkQueue.map((item, idx) => (
            <tbody
              key={idx}
              onClick={() =>
                setFocusedWorkItem({
                  queueType: 'workQueue',
                  uiKey: item.uiKey,
                })
              }
            >
              <tr
                onClick={e => {
                  e.stopPropagation();

                  navigateToPathSequence({
                    path: documentHelper({
                      docketNumber: item.docketNumber,
                      documentId: item.document.documentId,
                    }),
                  });
                }}
              >
                <td className="focus-toggle">
                  <button
                    className="focus-button usa-button usa-button--unstyled"
                    aria-label="Expand message detail"
                    aria-expanded={item.isFocused}
                    aria-controls={`detail-${item.workItemId}`}
                  />{' '}
                </td>
                <td
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  className="message-select-control has-icon"
                >
                  <input
                    id={item.workItemId}
                    type="checkbox"
                    className="usa-checkbox__input"
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
                    className="usa-checkbox__label padding-top-05"
                  />
                </td>
                <td className="message-queue-row">
                  <span className="no-wrap">{item.docketNumberWithSuffix}</span>
                </td>
                <td className="message-queue-row">
                  <span className="no-wrap">
                    {item.currentMessage.createdAtFormatted}
                  </span>
                </td>
                <td className="message-queue-row has-icon">
                  {item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      icon={['far', 'clock']}
                      className={item.statusIcon}
                      aria-hidden="true"
                    />
                  )}
                  {item.showUnassignedIcon && (
                    <FontAwesomeIcon
                      icon={['fas', 'question-circle']}
                      className="iconStatusUnassigned"
                      aria-hidden="true"
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
                      {item.currentMessage.message}
                    </div>
                  )}
                </td>
                <td className="message-queue-row">{item.caseStatus}</td>
                <td className="to message-queue-row">{item.assigneeName}</td>
                {!workQueueHelper.hideFromColumn && (
                  <td className="message-queue-row">
                    {item.currentMessage.from}
                  </td>
                )}
                {!workQueueHelper.hideSectionColumn && (
                  <td className="message-queue-row">{item.sentBySection}</td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueInbox = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    documentHelper: state.documentHelper,
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
              {workQueueHelper.showSelectColumn && <th colSpan="2">&nbsp;</th>}
              <th aria-label="Docket Number">Docket</th>
              <th>Received</th>
              {!workQueueHelper.hideIconColumn && (
                <th aria-label="Status Icon" className="padding-right-0" />
              )}
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
              {workQueueHelper.showAssignedToColumn && (
                <th>{workQueueHelper.assigneeColumnTitle}</th>
              )}
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
              <tr>
                {workQueueHelper.showSelectColumn && (
                  <>
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
                        selectWorkItemSequence({
                          workItem: item,
                        });
                        e.stopPropagation();
                      }}
                      className="message-select-control"
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
                  </>
                )}
                <td className="message-queue-row">
                  <span className="no-wrap">{item.docketNumberWithSuffix}</span>
                </td>
                <td className="message-queue-row">
                  <span className="no-wrap">{item.received}</span>
                </td>
                {!workQueueHelper.hideIconColumn && (
                  <td className="message-queue-row has-icon padding-right-0">
                    {item.showBatchedStatusIcon && (
                      <FontAwesomeIcon
                        icon={['far', 'clock']}
                        className="iconStatusBatched"
                        aria-hidden="true"
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
                    {item.showUnassignedIcon && (
                      <FontAwesomeIcon
                        icon={['fas', 'question-circle']}
                        className="iconStatusUnassigned"
                        aria-hidden="true"
                        size="lg"
                      />
                    )}
                  </td>
                )}
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
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">{item.document.filedBy}</td>
                )}
                <td className="message-queue-row">{item.caseStatus}</td>
                {workQueueHelper.showAssignedToColumn && (
                  <td className="to message-queue-row">{item.assigneeName}</td>
                )}
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

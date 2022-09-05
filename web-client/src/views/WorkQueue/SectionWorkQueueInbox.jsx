import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { workQueueItemsAreEqual } from '../../presenter/computeds/formattedWorkQueue';
import React from 'react';

const SectionWorkQueueTable = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    hideFiledByColumn: state.workQueueHelper.hideFiledByColumn,
    hideIconColumn: state.workQueueHelper.hideIconColumn,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    showAssignedToColumn: state.workQueueHelper.showAssignedToColumn,
    showSelectColumn: state.workQueueHelper.showSelectColumn,
  },
  function SectionWorkQueueTableComponent({
    formattedWorkQueue,
    hideFiledByColumn,
    hideIconColumn,
    selectWorkItemSequence,
    showAssignedToColumn,
    showSelectColumn,
  }) {
    return (
      <table
        aria-describedby="tab-work-queue"
        className="usa-table ustc-table subsection"
        id="section-work-queue"
      >
        <thead>
          <tr>
            {showSelectColumn && <th colSpan="2">&nbsp;</th>}
            <th aria-label="Docket Number">Docket No.</th>
            <th>Filed</th>
            <th>Case Title</th>
            {!hideIconColumn && (
              <th aria-label="Status Icon" className="padding-right-0" />
            )}
            <th>Document</th>
            {!hideFiledByColumn && <th>Filed By</th>}
            <th>Case Status</th>
            {showAssignedToColumn && <th>Assigned To</th>}
          </tr>
        </thead>
        {formattedWorkQueue.map(formattedWorkItem => (
          <SectionWorkQueueTable.Row
            hideFiledByColumn={hideFiledByColumn}
            hideIconColumn={hideIconColumn}
            item={formattedWorkItem}
            key={formattedWorkItem.workItemId}
            selectWorkItemSequence={selectWorkItemSequence}
            showAssignedToColumn={showAssignedToColumn}
            showSelectColumn={showSelectColumn}
          />
        ))}
      </table>
    );
  },
);

SectionWorkQueueTable.Row = React.memo(
  function SectionWorkQueueTableRowComponent({
    hideFiledByColumn,
    hideIconColumn,
    item,
    selectWorkItemSequence,
    showAssignedToColumn,
    showSelectColumn,
  }) {
    return (
      <tbody>
        <tr>
          {showSelectColumn && (
            <>
              <td aria-hidden="true" />
              <td className="message-select-control">
                <input
                  aria-label="Select work item"
                  checked={item.selected}
                  className="usa-checkbox__input"
                  id={item.workItemId}
                  type="checkbox"
                  onChange={() => {
                    selectWorkItemSequence({
                      workItem: item,
                    });
                  }}
                />
                <label
                  className="padding-top-05 usa-checkbox__label"
                  htmlFor={item.workItemId}
                  id={`label-${item.workItemId}`}
                />
              </td>
            </>
          )}
          <td className="message-queue-row">
            <CaseLink formattedCase={item} />
          </td>
          <td className="message-queue-row">
            <span className="no-wrap">{item.received}</span>
          </td>
          <td className="message-queue-row message-queue-case-title">
            {item.caseTitle}
          </td>
          {!hideIconColumn && (
            <td className="message-queue-row has-icon padding-right-0">
              {item.showUnassignedIcon && (
                <Icon
                  aria-label="unassigned"
                  className="iconStatusUnassigned"
                  icon={['fas', 'question-circle']}
                  size="lg"
                />
              )}
              {item.showHighPriorityIcon && (
                <Icon
                  aria-label="high priority"
                  className="iconHighPriority"
                  icon={['fas', 'exclamation-circle']}
                  size="lg"
                />
              )}
            </td>
          )}
          <td className="message-queue-row max-width-25">
            <div className="message-document-title">
              <a className="case-link" href={item.editLink}>
                {item.docketEntry.descriptionDisplay}
              </a>
            </div>
          </td>
          {!hideFiledByColumn && (
            <td className="message-queue-row">{item.docketEntry.filedBy}</td>
          )}
          <td className="message-queue-row">{item.caseStatus}</td>
          {showAssignedToColumn && (
            <td className="to message-queue-row">{item.assigneeName}</td>
          )}
        </tr>
      </tbody>
    );
  },
  workQueueItemsAreEqual,
);

SectionWorkQueueTable.Actions = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectedWorkItemsLength: state.selectedWorkItems.length,
    users: state.users,
  },
  function SectionWorkQueueActionsComponent({
    assignSelectedWorkItemsSequence,
    selectAssigneeSequence,
    selectedWorkItemsLength,
    users,
  }) {
    return (
      <div className="action-section">
        <span className="assign-work-item-count">
          <Icon aria-label="selected work items count" icon="check" />
          {selectedWorkItemsLength}
        </span>
        <select
          aria-label="select an assignee"
          className="usa-select"
          id="options"
          name="options"
          onChange={evt => {
            selectAssigneeSequence({
              assigneeId: evt.target.value,
              assigneeName: evt.target.options[evt.target.selectedIndex].text,
            });
            assignSelectedWorkItemsSequence();
          }}
        >
          <option value>Assign to...</option>
          {users.map(user => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export const SectionWorkQueueInbox = connect(
  {
    formattedWorkQueueLength: state.formattedWorkQueue.length,
    showSendToBar: state.workQueueHelper.showSendToBar,
  },
  function SectionWorkQueueInbox({ formattedWorkQueueLength, showSendToBar }) {
    return (
      <React.Fragment>
        {showSendToBar && <SectionWorkQueueTable.Actions />}
        <SectionWorkQueueTable />
        {formattedWorkQueueLength === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

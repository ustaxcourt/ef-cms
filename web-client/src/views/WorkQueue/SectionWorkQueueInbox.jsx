import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import { range } from 'lodash';
import React from 'react';

const SectionWorkQueueTable = connect(
  {
    workQueueHelper: state.workQueueHelper,
    workQueueLength: state.formattedWorkQueue.length,
  },
  function SectionWorkQueueTableComponent({
    workQueueHelper,
    workQueueLength,
  }) {
    const rowIndexes = range(0, workQueueLength);
    return (
      <table
        aria-describedby="tab-work-queue"
        className="usa-table work-queue subsection"
        id="section-work-queue"
      >
        <thead>
          <tr>
            {workQueueHelper.showSelectColumn && <th colSpan="2">&nbsp;</th>}
            <th aria-label="Docket Number">Docket No.</th>
            <th>Filed</th>
            <th>Case Title</th>
            {!workQueueHelper.hideIconColumn && (
              <th aria-label="Status Icon" className="padding-right-0" />
            )}
            <th>Document</th>
            {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
            <th>Case Status</th>
            {workQueueHelper.showAssignedToColumn && <th>Assigned To</th>}
          </tr>
        </thead>
        {rowIndexes.map(idx => (
          <SectionWorkQueueTable.Row idx={idx} key={idx} />
        ))}
      </table>
    );
  },
);

SectionWorkQueueTable.Row = connect(
  {
    item: state.formattedWorkQueue[props.idx],
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueTableRowComponent({
    item,
    selectWorkItemSequence,
    workQueueHelper,
  }) {
    return (
      <tbody>
        <tr>
          {workQueueHelper.showSelectColumn && (
            <>
              <td aria-hidden="true" className="focus-toggle" />
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
                  className="usa-checkbox__label padding-top-05"
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
          {!workQueueHelper.hideIconColumn && (
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
          <td className="message-queue-row message-queue-document">
            <div className="message-document-title">
              <a className="case-link" href={item.editLink}>
                {item.docketEntry.descriptionDisplay}
              </a>
            </div>
          </td>
          {!workQueueHelper.hideFiledByColumn && (
            <td className="message-queue-row">{item.docketEntry.filedBy}</td>
          )}
          <td className="message-queue-row">{item.caseStatus}</td>
          {workQueueHelper.showAssignedToColumn && (
            <td className="to message-queue-row">{item.assigneeName}</td>
          )}
        </tr>
      </tbody>
    );
  },
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
          onChange={event => {
            selectAssigneeSequence({
              assigneeId: event.target.value,
              assigneeName:
                event.target.options[event.target.selectedIndex].text,
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

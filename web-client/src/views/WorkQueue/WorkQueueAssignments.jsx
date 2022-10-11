import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WorkQueueAssignments = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    formattedWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectedWorkItemsLength: state.selectedWorkItems.length,
  },
  function WorkQueueAssignments({
    assignSelectedWorkItemsSequence,
    formattedWorkQueue,
    selectAssigneeSequence,
    selectedWorkItemsLength,
    showSendToBar,
    users,
  }) {
    return (
      <React.Fragment>
        <div className="action-section grid-row inline-block margin-bottom-1">
          <label
            className="dropdown-label-serif padding-top-05"
            htmlFor="inline-select"
            id="trial-sessions-filter-label"
          >
            Filter by
          </label>
          <BindedSelect
            aria-label="assignment"
            bind="screenMetadata.assignmentFilterValue.userId"
            className="select-left inline-select margin-left-1pt5rem"
            id="assignmentFilter"
            name="assignment"
          >
            <option value="">-Assignment-</option>
            <option value="UA">Unassigned</option>
            {users.map(user => (
              <option key={user.name} value={user.userId}>
                {user.name}
              </option>
            ))}
          </BindedSelect>
          <select
            aria-label="select an assignee"
            className="usa-select select-left inline-select margin-left-1pt5rem"
            disabled={!showSendToBar}
            id="options"
            name="options"
            onChange={evt => {
              selectAssigneeSequence({
                assigneeId: evt.target.value,
                assigneeName: evt.target.options[evt.target.selectedIndex].text,
                evt,
              });
              assignSelectedWorkItemsSequence();
            }}
          >
            <option key="assignTo" value="">
              Assign to...
            </option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
          {showSendToBar && (
            <span className="assign-work-item-count">
              <Icon aria-label="selected work items count" icon="check" />
              {selectedWorkItemsLength}
            </span>
          )}
        </div>
        <div className="push-right margin-top-4">
          <b>Count:</b> {formattedWorkQueue.length}
        </div>
      </React.Fragment>
    );
  },
);

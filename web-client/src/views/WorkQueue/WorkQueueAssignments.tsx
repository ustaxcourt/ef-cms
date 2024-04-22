import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const WorkQueueAssignments = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    clearSelectedWorkItemsSequence: sequences.clearSelectedWorkItemsSequence,
    formattedWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectedWorkItemsLength: state.selectedWorkItems.length,
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueueAssignments({
    assignSelectedWorkItemsSequence,
    clearSelectedWorkItemsSequence,
    formattedWorkQueue,
    selectAssigneeSequence,
    selectedWorkItemsLength,
    users,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        {workQueueHelper.showDocketClerkFilter ? (
          <>
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
                data-testid="dropdown-select-assignee"
                id="assignmentFilter"
                name="assignment"
                onChange={() => {
                  clearSelectedWorkItemsSequence();
                }}
              >
                <option value="">-Assignment-</option>
                <option value="UA">Unassigned</option>
                {users.map(user => (
                  <option key={user.name} value={user.userId}>
                    {user.name}
                  </option>
                ))}
              </BindedSelect>
              {workQueueHelper.currentBoxView !== 'outbox' && (
                <select
                  aria-label="select an assignee"
                  className="usa-select select-left inline-select margin-left-1pt5rem"
                  disabled={!workQueueHelper.showSendToBar}
                  id="options"
                  name="options"
                  onChange={evt => {
                    selectAssigneeSequence({
                      assigneeId: evt.target.value,
                      assigneeName:
                        evt.target.options[evt.target.selectedIndex].text,
                    });
                    assignSelectedWorkItemsSequence();
                    //reset input manually
                    evt.target.value = '';
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
              )}
              {workQueueHelper.showSendToBar && (
                <span
                  className="assign-work-item-count-docket"
                  data-testid="assign-work-item-count-docket"
                >
                  <Icon aria-label="selected work items count" icon="check" />
                  {selectedWorkItemsLength}
                </span>
              )}
            </div>
            <div className="push-right margin-top-4">
              <b>Count:</b> {formattedWorkQueue.length}
            </div>
          </>
        ) : (
          <>
            {workQueueHelper.showSendToBar && (
              <div className="action-section">
                <span className="assign-work-item-count">
                  <Icon aria-label="selected work items count" icon="check" />
                  {selectedWorkItemsLength}
                </span>
                <select
                  aria-label="select an assignee"
                  className="usa-select"
                  data-testid="dropdown-select-assignee"
                  id="options"
                  name="options"
                  onChange={evt => {
                    selectAssigneeSequence({
                      assigneeId: evt.target.value,
                      assigneeName:
                        evt.target.options[evt.target.selectedIndex].text,
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
            )}
          </>
        )}
      </React.Fragment>
    );
  },
);

WorkQueueAssignments.displayName = 'WorkQueueAssignments';

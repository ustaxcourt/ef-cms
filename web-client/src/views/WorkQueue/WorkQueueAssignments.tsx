import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { RawUser } from '@shared/business/entities/User';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';

type WorkQueueAssignmentsProps = {
  users: RawUser[];
};

const workQueueAssignmentsDeps = {
  assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
  clearSelectedWorkItemsSequence: sequences.clearSelectedWorkItemsSequence,
  formattedWorkQueue: state.formattedWorkQueue,
  selectAssigneeSequence: sequences.selectAssigneeSequence,
  selectedWorkItemsLength: state.selectedWorkItems.length,
  workQueueHelper: state.workQueueHelper,
};

export const WorkQueueAssignments = connect<
  WorkQueueAssignmentsProps,
  typeof workQueueAssignmentsDeps
>(
  workQueueAssignmentsDeps,
  function WorkQueueAssignments({
    assignSelectedWorkItemsSequence,
    clearSelectedWorkItemsSequence,
    formattedWorkQueue,
    selectAssigneeSequence,
    selectedWorkItemsLength,
    users,
    workQueueHelper,
  }) {
    const { currentBoxView, showSendToBar, showDocketClerkFilter } =
      workQueueHelper;

    if (showDocketClerkFilter)
      return DocketClerkFilterMarkup({
        clearSelectedWorkItemsSequence,
        users,
        currentBoxView,
        selectAssigneeSequence,
        showSendToBar,
        assignSelectedWorkItemsSequence,
        selectedWorkItemsLength,
        formattedWorkQueueLength: formattedWorkQueue.length,
      });

    if (showSendToBar)
      return AssignToBarMarkup({
        selectedWorkItemsLength,
        selectAssigneeSequence,
        assignSelectedWorkItemsSequence,
        users,
        formattedWorkQueueLength: formattedWorkQueue.length,
      });

    return;
  },
);

type DocketClerkFilterMarkupParams = {
  clearSelectedWorkItemsSequence: Function;
  users: RawUser[];
  currentBoxView: string;
  selectAssigneeSequence: Function;
  showSendToBar: boolean;
  assignSelectedWorkItemsSequence: Function;
  selectedWorkItemsLength: number;
  formattedWorkQueueLength: number;
};

function DocketClerkFilterMarkup({
  clearSelectedWorkItemsSequence,
  users,
  currentBoxView,
  selectAssigneeSequence,
  showSendToBar,
  assignSelectedWorkItemsSequence,
  selectedWorkItemsLength,
  formattedWorkQueueLength,
}: DocketClerkFilterMarkupParams): React.JSX.Element {
  function Markup(isMobile: boolean) {
    const DROPDOWN_STYLE = isMobile
      ? 'margin-left-0 margin-top-2 force-full-width'
      : 'margin-left-1pt5rem inline-select usa-select';

    return (
      <>
        <div
          className={`action-section grid-row ${isMobile ? '' : ' inline-block margin-bottom-1'}`}
        >
          <label
            className={`dropdown-label-serif padding-top-05 mobile:grid-col-12 ${isMobile ? 'margin-bottom-1' : ''}`}
            htmlFor="inline-select"
            id="trial-sessions-filter-label"
          >
            Filter by
          </label>
          <BindedSelect
            aria-label="assignment"
            bind="screenMetadata.assignmentFilterValue.userId"
            className={`select-left ${DROPDOWN_STYLE}`}
            data-testid="dropdown-filter-assignee"
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
          {currentBoxView !== 'outbox' && (
            <select
              aria-label="select an assignee"
              className={`usa-select select-left ${DROPDOWN_STYLE}`}
              data-testid="dropdown-select-assignee"
              disabled={!showSendToBar}
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
          {showSendToBar && (
            <span
              className={`assign-work-item-count-docket ${isMobile && 'assign-work-item-count-docket-mobile'}`}
              data-testid="assign-work-item-count-docket"
            >
              <Icon aria-label="selected work items count" icon="check" />
              {selectedWorkItemsLength}
            </span>
          )}
        </div>
        <div
          className={`push-right ${isMobile ? 'margin-bottom-3 grid-col-12 text-align-right' : 'margin-top-4'}`}
        >
          <b className="text-semibold">Count:</b> {formattedWorkQueueLength}
        </div>
      </>
    );
  }

  return (
    <>
      <Mobile>{Markup(true)}</Mobile>
      <NonMobile>{Markup(false)}</NonMobile>
    </>
  );
}

type AssignToBarMarkupParams = {
  selectedWorkItemsLength: number;
  selectAssigneeSequence: Function;
  assignSelectedWorkItemsSequence: Function;
  users: RawUser[];
  formattedWorkQueueLength: number;
};

function AssignToBarMarkup({
  selectedWorkItemsLength,
  selectAssigneeSequence,
  assignSelectedWorkItemsSequence,
  users,
  formattedWorkQueueLength,
}: AssignToBarMarkupParams) {
  return (
    <>
      <div className="action-section grid-row inline-block margin-bottom-1">
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
              assigneeName: evt.target.options[evt.target.selectedIndex].text,
            });
            assignSelectedWorkItemsSequence();
          }}
        >
          <option value="">Assign to...</option>
          {users.map(user => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="push-right margin-top-4">
        <b className="text-semibold">Count:</b> {formattedWorkQueueLength}
      </div>
    </>
  );
}

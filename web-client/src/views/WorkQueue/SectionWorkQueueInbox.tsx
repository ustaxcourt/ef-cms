import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { workQueueItemsAreEqual } from '../../presenter/computeds/formattedWorkQueue';
import React from 'react';

const SectionWorkQueueTable = connect(
  {
    FROM_PAGES: state.constants.FROM_PAGES,
    formattedWorkQueue: state.formattedWorkQueue,
    hideIconColumn: state.workQueueHelper.hideIconColumn,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    showAssignedToColumn: state.workQueueHelper.showAssignedToColumn,
    showFiledByColumn: state.workQueueHelper.showFiledByColumn,
    showSelectAllCheckbox: state.workQueueHelper.showSelectAllCheckbox,
    showSelectColumn: state.workQueueHelper.showSelectColumn,
    toggleAllWorkItemCheckboxChangeSequence:
      sequences.toggleAllWorkItemCheckboxChangeSequence,
    workitemAllCheckbox: state.workitemAllCheckbox,
  },
  function SectionWorkQueueTableComponent({
    formattedWorkQueue,
    FROM_PAGES,
    hideIconColumn,
    selectWorkItemSequence,
    showAssignedToColumn,
    showFiledByColumn,
    showSelectAllCheckbox,
    showSelectColumn,
    toggleAllWorkItemCheckboxChangeSequence,
    workitemAllCheckbox,
  }) {
    return (
      <table
        aria-describedby="tab-work-queue"
        className="usa-table ustc-table subsection"
        id="section-work-queue"
      >
        <thead>
          <tr>
            {showSelectColumn && (
              <th className="message-select-control select-all-checkbox">
                {showSelectAllCheckbox && (
                  <>
                    <input
                      aria-label="select all work items"
                      checked={workitemAllCheckbox}
                      className="usa-checkbox__input"
                      id="workitem-select-all-checkbox"
                      name="workitem-select-all-checkbox"
                      type="checkbox"
                      value="workitem-select-all-checkbox"
                      onChange={() => toggleAllWorkItemCheckboxChangeSequence()}
                    />
                    <label
                      className="padding-top-05 usa-checkbox__label"
                      htmlFor="workitem-select-all-checkbox"
                      id="label-workitem-select-all-checkbox"
                    />
                  </>
                )}
              </th>
            )}
            <th aria-hidden="true" className="consolidated-case-column"></th>
            <th aria-label="Docket Number" className="no-wrap">
              Docket No.
            </th>
            <th>Filed</th>
            <th>Case Title</th>
            {!hideIconColumn && (
              <th aria-label="Status Icon" className="padding-right-0" />
            )}
            <th>Document</th>
            {showFiledByColumn && <th>Filed By</th>}
            <th>Case Status</th>
            {showAssignedToColumn && <th className="no-wrap">Assigned To</th>}
          </tr>
        </thead>
        {formattedWorkQueue.map(formattedWorkItem => {
          return (
            <SectionWorkQueueTable.Row
              FROM_PAGES={FROM_PAGES}
              hideIconColumn={hideIconColumn}
              item={formattedWorkItem}
              key={formattedWorkItem.workItemId}
              selectWorkItemSequence={selectWorkItemSequence}
              showAssignedToColumn={showAssignedToColumn}
              showFiledByColumn={showFiledByColumn}
              showSelectColumn={showSelectColumn}
            />
          );
        })}
      </table>
    );
  },
);

SectionWorkQueueTable.Row = React.memo(
  function SectionWorkQueueTableRowComponent({
    hideIconColumn,
    item,
    selectWorkItemSequence,
    showAssignedToColumn,
    showFiledByColumn,
    showSelectColumn,
  }) {
    return (
      <tbody>
        <tr>
          {showSelectColumn && (
            <td className="message-select-control">
              <div className="usa-checkbox">
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
              </div>
            </td>
          )}
          <td className="consolidated-case-column">
            <ConsolidatedCaseIcon
              consolidatedIconTooltipText={item.consolidatedIconTooltipText}
              inConsolidatedGroup={item.inConsolidatedGroup}
              showLeadCaseIcon={item.inLeadCase}
            />
          </td>

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
          {showFiledByColumn && (
            <td className="message-queue-row">{item.docketEntry.filedBy}</td>
          )}
          <td className="message-queue-row">{item.formattedCaseStatus}</td>
          {showAssignedToColumn && (
            <td className="to message-queue-row">{item.assigneeName}</td>
          )}
        </tr>
      </tbody>
    );
  },
  workQueueItemsAreEqual,
);

export const SectionWorkQueueInbox = connect(
  {
    formattedWorkQueueLength: state.formattedWorkQueue.length,
    users: state.users,
  },
  function SectionWorkQueueInbox({ formattedWorkQueueLength, users }) {
    return (
      <React.Fragment>
        <WorkQueueAssignments users={users} />
        <SectionWorkQueueTable />
        {formattedWorkQueueLength === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueInbox.displayName = 'SectionWorkQueueInbox';

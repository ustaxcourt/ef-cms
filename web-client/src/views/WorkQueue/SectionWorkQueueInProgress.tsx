import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { workQueueItemsAreEqual } from '../../presenter/computeds/formattedWorkQueue';
import React from 'react';

const SectionWorkQueueInProgressRow = React.memo(
  function SectionWorkQueueInProgressRowComponent({
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
          <td className="message-queue-row max-width-25">
            <div className="message-document-title">
              <a className="case-link" href={item.editLink}>
                {item.docketEntry.descriptionDisplay ||
                  item.docketEntry.documentType}
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

export const SectionWorkQueueInProgress = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    formattedWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    selectedWorkItemsLength: state.selectedWorkItems.length,
    showSelectAllCheckbox: state.workQueueHelper.showSelectAllCheckbox,
    showSelectColumn: state.workQueueHelper.showSelectColumn,
    toggleAllWorkItemCheckboxChangeSequence:
      sequences.toggleAllWorkItemCheckboxChangeSequence,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
    workitemAllCheckbox: state.workitemAllCheckbox,
  },
  function SectionWorkQueueInProgress({
    formattedWorkQueue,
    selectWorkItemSequence,
    showSelectAllCheckbox,
    showSelectColumn,
    toggleAllWorkItemCheckboxChangeSequence,
    users,
    workitemAllCheckbox,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        <WorkQueueAssignments users={users} />
        <table
          aria-describedby="tab-work-queue"
          className="usa-table ustc-table subsection"
          id="section-work-queue"
        >
          <thead>
            <tr>
              {showSelectColumn && (
                <>
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
                          onChange={() =>
                            toggleAllWorkItemCheckboxChangeSequence()
                          }
                        />
                        <label
                          className="padding-top-05 usa-checkbox__label"
                          htmlFor="workitem-select-all-checkbox"
                          id="label-workitem-select-all-checkbox"
                        />
                      </>
                    )}
                  </th>
                </>
              )}
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="no-wrap">
                Docket No.
              </th>
              <th>Filed</th>
              <th>Case Title</th>
              <th>Document</th>
              {workQueueHelper.showFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
              {workQueueHelper.showAssignedToColumn && (
                <th className="no-wrap">Assigned To</th>
              )}
            </tr>
          </thead>
          {formattedWorkQueue.map(item => {
            return (
              <SectionWorkQueueInProgressRow
                item={item}
                key={item.workItemId}
                selectWorkItemSequence={selectWorkItemSequence}
                showAssignedToColumn={workQueueHelper.showAssignedToColumn}
                showFiledByColumn={workQueueHelper.showFiledByColumn}
                showSelectColumn={workQueueHelper.showSelectColumn}
              />
            );
          })}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueInProgress.displayName = 'SectionWorkQueueInProgress';

import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { FormattedWorkItemWithCaseInfo } from '@web-client/presenter/computeds/formattedWorkQueue';
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
        data-testid="section-work-queue-inbox"
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
                      data-testid="checkbox-select-all-workitems"
                      htmlFor="workitem-select-all-checkbox"
                      id="label-workitem-select-all-checkbox"
                    >
                      {''}
                    </label>
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
        <tbody>
          {formattedWorkQueue.map(formattedWorkItem => {
            return (
              <SectionWorkQueueTableRow
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
        </tbody>
      </table>
    );
  },
);

function SectionWorkQueueTableRow({
  hideIconColumn,
  item,
  selectWorkItemSequence,
  showAssignedToColumn,
  showFiledByColumn,
  showSelectColumn,
}: {
  hideIconColumn: boolean;
  item: FormattedWorkItemWithCaseInfo;
  selectWorkItemSequence: Function;
  showAssignedToColumn: boolean;
  showFiledByColumn: boolean;
  showSelectColumn: boolean;
}) {
  return (
    <tr data-testid={`work-item-${item.docketNumber}`}>
      {showSelectColumn && (
        <td className="message-select-control">
          <div className="usa-checkbox">
            <input
              aria-label="Select work item"
              checked={item.selected}
              className="usa-checkbox__input"
              data-testid="select-work-item"
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
              data-testid="checkbox-assign-work-item"
              htmlFor={item.workItemId}
              id={`label-${item.workItemId}`}
            >
              {''}
            </label>
          </div>
        </td>
      )}
      <td className="consolidated-case-column">
        {item.groupedMemberCases ? (
          <div className="consolidated-icons-stack" aria-hidden="true">
            <ConsolidatedCaseIcon
              consolidatedIconTooltipText={item.consolidatedIconTooltipText}
              inConsolidatedGroup={item.inConsolidatedGroup}
              showLeadCaseIcon={item.inLeadCase}
            />
            {item.groupedMemberCases.map(c => (
              <ConsolidatedCaseIcon
                key={`icon-${c.docketNumber}`}
                consolidatedIconTooltipText={
                  c.inLeadCase ? 'Lead case' : 'Consolidated case'
                }
                inConsolidatedGroup={true}
                showLeadCaseIcon={c.inLeadCase}
              />
            ))}
          </div>
        ) : (
          <ConsolidatedCaseIcon
            consolidatedIconTooltipText={item.consolidatedIconTooltipText}
            inConsolidatedGroup={item.inConsolidatedGroup}
            showLeadCaseIcon={item.inLeadCase}
          />
        )}
      </td>

      <td className="message-queue-row">
        {item.groupedMemberCases ? (
          <div className="grouped-cases-row">
            <CaseLink formattedCase={item} />
            <div className="member-case-links">
              {item.groupedMemberCases.map(c => (
                <div key={c.docketNumber} className="member-case-line">
                  <CaseLink formattedCase={c} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CaseLink formattedCase={item} />
        )}
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
              aria-label="Unassigned"
              className="iconStatusUnassigned"
              icon={['fas', 'question-circle']}
              size="lg"
            />
          )}
          {item.showHighPriorityIcon && (
            <Icon
              aria-label="High priority"
              className="iconHighPriority"
              icon={['fas', 'exclamation-circle']}
              size="lg"
            />
          )}
        </td>
      )}
      <td className="message-queue-row max-width-25">
        <div className="message-document-title">
          {item.editLink ? (
            <a
              className="case-link"
              href={item.editLink}
              data-testid={`work-item-document-link-${item.docketNumber}`}
            >
              {item.docketEntry.descriptionDisplay}
            </a>
          ) : (
            <span>
              {item.docketEntry.descriptionDisplay ||
                item.docketEntry.documentType}
            </span>
          )}
        </div>
      </td>
      {showFiledByColumn && (
        <td className="message-queue-row">{item.docketEntry.filedBy}</td>
      )}
      <td className="message-queue-row">{item.formattedCaseStatus}</td>
      {showAssignedToColumn && (
        <td
          className="to message-queue-row"
          data-testid="table-column-work-item-assigned-to"
        >
          {item.assigneeName}
        </td>
      )}
    </tr>
  );
}

export const SectionWorkQueueInbox = connect(
  {
    formattedWorkQueueLength: state.formattedWorkQueue.length,
    users: state.users,
  },
  function SectionWorkQueueInbox({ formattedWorkQueueLength, users }) {
    return (
      <React.Fragment>
        <WorkQueueAssignments users={users} count={formattedWorkQueueLength} />
        <SectionWorkQueueTable />
        {formattedWorkQueueLength === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueInbox.displayName = 'SectionWorkQueueInbox';

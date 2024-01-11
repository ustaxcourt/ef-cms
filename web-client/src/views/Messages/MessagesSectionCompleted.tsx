import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const MessagesSectionCompleted = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionCompleted({
    constants,
    formattedMessages,
    screenMetadata,
    sortTableSequence,
    tableSort,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        {formattedMessages.showFilters && (
          <TableFilters
            filters={[
              {
                isSelected: screenMetadata.completedBy,
                key: 'completedBy',
                label: 'Completed By',
                options: formattedMessages.completedByUsers,
                useInlineSelect: false,
              },
            ]}
            onSelect={updateScreenMetadataSequence}
          ></TableFilters>
        )}

        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="small" colSpan={2}>
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  dataTestID="message-section-docket-number-header-button"
                  defaultSortOrder={constants.DESCENDING}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="docketNumber"
                  title="Docket No."
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th className="medium">
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  dataTestID="message-section-completed-at-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="completedAt"
                  title="Completed"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  dataTestID="message-section-subject-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="subject"
                  title="Last Message"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>Comment</th>
              <th>Completed By</th>
              <th>Section</th>
            </tr>
          </thead>
          {formattedMessages.completedMessages.map(message => (
            <CompletedMessageRow key={message.messageId} message={message} />
          ))}
        </table>
        {!formattedMessages.hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

MessagesSectionCompleted.displayName = 'MessagesSectionCompleted';

const CompletedMessageRow = React.memo(function CompletedMessageRow({
  message,
}) {
  return (
    <tbody>
      <tr>
        <td className="consolidated-case-column">
          <ConsolidatedCaseIcon
            consolidatedIconTooltipText={message.consolidatedIconTooltipText}
            inConsolidatedGroup={message.inConsolidatedGroup}
            showLeadCaseIcon={message.isLeadCase}
          />
        </td>
        <td
          className="message-queue-row small"
          colSpan={2}
          data-testid="section-message-completed-docket-number-cell"
        >
          {message.docketNumberWithSuffix}
        </td>
        <td
          className="message-queue-row small"
          data-testid="section-message-completed-completed-at-cell"
        >
          <span className="no-wrap">{message.completedAtFormatted}</span>
        </td>
        <td className="message-queue-row">
          <div
            className="message-document-title"
            data-testid="section-message-completed-subject-cell"
          >
            <Button link className="padding-0" href={message.messageDetailLink}>
              {message.subject}
            </Button>
          </div>

          <div className="message-document-detail">{message.message}</div>
        </td>
        <td className="message-queue-row">{message.completedMessage}</td>
        <td className="message-queue-row">{message.completedBy}</td>
        <td className="message-queue-row">{message.completedBySection}</td>
      </tr>
    </tbody>
  );
});

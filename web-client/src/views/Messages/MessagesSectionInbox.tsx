import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const MessagesSectionInbox = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionInbox({
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
                isSelected: screenMetadata.caseStatus,
                key: 'caseStatus',
                label: 'Case Status',
                options: formattedMessages.caseStatuses,
              },
              {
                isSelected: screenMetadata.toUser,
                key: 'toUser',
                label: 'To',
                options: formattedMessages.toUsers,
              },
              {
                isSelected: screenMetadata.fromUser,
                key: 'fromUser',
                label: 'From',
                options: formattedMessages.fromUsers,
              },
              {
                isSelected: screenMetadata.fromSection,
                key: 'fromSection',
                label: 'Section',
                options: formattedMessages.fromSections,
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
                  data-testid="message-section-docket-number-header-button"
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
                  data-testid="message-section-received-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="createdAt"
                  title="Received"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  data-testid="message-section-subject-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="subject"
                  title="Message"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>Case Title</th>
              <th>Case Status</th>
              <th>To</th>
              <th>From</th>
              <th className="small">Section</th>
            </tr>
          </thead>
          {formattedMessages.messages.map(message => (
            <MessageInboxRow key={message.messageId} message={message} />
          ))}
        </table>
        {!formattedMessages.hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

MessagesSectionInbox.displayName = 'MessagesSectionInbox';

const MessageInboxRow = React.memo(function MessageInboxRow({ message }) {
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
          data-testid="section-message-inbox-docket-number-cell"
        >
          {message.docketNumberWithSuffix}
        </td>
        <td
          className="message-queue-row small"
          data-testid="section-message-inbox-received-at-cell"
        >
          <span className="no-wrap">{message.createdAtFormatted}</span>
        </td>
        <td className="message-queue-row message-subject">
          <div className="message-document-title">
            <Button
              link
              section-message-inbox-subject-cell
              className="padding-0"
              data-testid="section-message-inbox-subject-cell"
              href={message.messageDetailLink}
            >
              {message.subject}
            </Button>
          </div>
          <div className="message-document-detail">{message.message}</div>
        </td>
        <td className="message-queue-row max-width-25">{message.caseTitle}</td>
        <td className="message-queue-row">{message.caseStatus}</td>
        <td className="message-queue-row to">{message.to}</td>
        <td className="message-queue-row from">{message.from}</td>
        <td className="message-queue-row small">
          {message.fromSectionFormatted}
        </td>
      </tr>
    </tbody>
  );
});

import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const MessagesIndividualOutbox = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesIndividualOutbox({
    constants,
    formattedMessages,
    screenMetadata,
    sortTableSequence,
    tableSort,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        <div className="overflow-x-auto">
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
                isSelected: screenMetadata.toSection,
                key: 'toSection',
                label: 'Section',
                options: formattedMessages.toSections,
              },
            ]}
            onSelect={updateScreenMetadataSequence}
          ></TableFilters>

          <table className="usa-table ustc-table subsection">
            <thead>
              <tr>
                <th
                  aria-hidden="true"
                  className="consolidated-case-column"
                ></th>
                <th aria-label="Docket Number" colSpan={2}>
                  <SortableColumn
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-outbox-docket-number-header-button"
                    defaultSortOrder={constants.DESCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="docketNumber"
                    title="Docket No."
                    onClickSequence={sortTableSequence}
                  />
                </th>
                <th>
                  <SortableColumn
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-outbox-completed-at-header-button"
                    defaultSortOrder={constants.DESCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="createdAt"
                    title="Sent"
                    onClickSequence={sortTableSequence}
                  />
                </th>
                <th>
                  <SortableColumn
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-outbox-subject-header-button"
                    defaultSortOrder={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="subject"
                    title="Message"
                    onClickSequence={sortTableSequence}
                  />
                </th>
                <th>
                  <SortableColumn
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-case-title-header-button"
                    defaultSortOrder={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="caseTitle"
                    title="Case Title"
                    onClickSequence={sortTableSequence}
                  />
                </th>
                <th>
                  <SortableColumn
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-case-status-header-button"
                    defaultSortOrder={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="caseStatus"
                    title="Case Status"
                    onClickSequence={sortTableSequence}
                  />
                </th>
                <th>
                  <SortableColumn
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-to-header-button"
                    defaultSortOrder={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="to"
                    title="To"
                    onClickSequence={sortTableSequence}
                  />
                </th>
                <th>
                  <SortableColumn
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    currentlySortedField={tableSort.sortField}
                    currentlySortedOrder={tableSort.sortOrder}
                    data-testid="message-individual-section-header-button"
                    defaultSortOrder={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="toSection"
                    title="Section"
                    onClickSequence={sortTableSequence}
                  />
                </th>
              </tr>
            </thead>
            {formattedMessages.messages.map(message => {
              return (
                <tbody key={`message-${message.messageId}`}>
                  <tr>
                    <td className="consolidated-case-column">
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          message.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={message.inConsolidatedGroup}
                        showLeadCaseIcon={message.isLeadCase}
                      />
                    </td>
                    <td
                      className="message-queue-row"
                      colSpan={2}
                      data-testid="individual-message-outbox-docket-number-cell"
                    >
                      {message.docketNumberWithSuffix}
                    </td>
                    <td
                      className="message-queue-row"
                      data-testid="individual-message-outbox-completed-at-cell"
                    >
                      <span className="no-wrap">
                        {message.createdAtFormatted}
                      </span>
                    </td>
                    <td
                      className="message-queue-row message-subject"
                      data-testid="individual-message-outbox-subject-cell"
                    >
                      <div className="message-document-title">
                        <Button
                          link
                          className="padding-0"
                          href={message.messageDetailLink}
                        >
                          {message.subject}
                        </Button>
                      </div>

                      <div className="message-document-detail">
                        {message.message}
                      </div>
                    </td>
                    <td className="message-queue-row max-width-25">
                      {message.caseTitle}
                    </td>
                    <td className="message-queue-row">{message.caseStatus}</td>
                    <td className="message-queue-row to">{message.to}</td>
                    <td className="message-queue-row">{message.toSection}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          {!formattedMessages.hasMessages && <div>There are no messages.</div>}
        </div>
      </>
    );
  },
);

MessagesIndividualOutbox.displayName = 'MessagesIndividualOutbox';

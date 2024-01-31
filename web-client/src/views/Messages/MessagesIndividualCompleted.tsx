import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const MessagesIndividualCompleted = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
  },
  function MessagesIndividualCompleted({
    constants,
    formattedMessages,
    sortTableSequence,
    tableSort,
  }) {
    return (
      <>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="small" colSpan={2}>
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  data-testid="message-individual-docket-number-header-button"
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
                  data-testid="message-individual-completed-at-header-button"
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
                  data-testid="message-individual-subject-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="subject"
                  title="Last Message"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>Comment</th>
              <th>Case Title</th>
            </tr>
          </thead>
          {formattedMessages.completedMessages.map(message => {
            return (
              <tbody key={`message-individual-${message.messageId}`}>
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
                    className="message-queue-row small"
                    colSpan={2}
                    data-testid="individual-message-completed-docket-number-cell"
                  >
                    {message.docketNumberWithSuffix}
                  </td>
                  <td
                    className="message-queue-row small"
                    data-testid="individual-message-completed-completed-at-cell"
                  >
                    <span className="no-wrap">
                      {message.completedAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row">
                    <div className="message-document-title">
                      <Button
                        link
                        className="padding-0"
                        data-testid="individual-message-completed-subject-cell"
                        href={message.messageDetailLink}
                      >
                        {message.subject}
                      </Button>
                    </div>
                    <div className="message-document-detail">
                      {message.message}
                    </div>
                  </td>
                  <td className="message-queue-row">
                    {message.completedMessage}
                  </td>
                  <td className="message-queue-row">{message.caseTitle}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {!formattedMessages.hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

MessagesIndividualCompleted.displayName = 'MessagesIndividualCompleted';

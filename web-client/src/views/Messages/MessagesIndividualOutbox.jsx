import { Button } from '../../ustc-ui/Button/Button';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { TableFilters } from '../../ustc-ui/TableFilters/TableFilters';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesIndividualOutbox = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesIndividualOutbox({
    constants,
    formattedMessages,
    screenMetadata,
    showSortableHeaders,
    sortMessagesSequence,
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
                isSelected: screenMetadata.toSection,
                key: 'toSection',
                label: 'Section',
                options: formattedMessages.toSections,
              },
            ]}
            onSelect={updateScreenMetadataSequence}
          ></TableFilters>
        )}
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              {showSortableHeaders && (
                <th aria-label="Docket Number" className="small" colSpan="2">
                  <SortableColumnHeaderButton
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.DESCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="docketNumber"
                    title="Docket No."
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && (
                <th aria-label="Docket Number" className="small" colSpan="2">
                  Docket No.
                </th>
              )}
              {showSortableHeaders && (
                <th className="small">
                  <SortableColumnHeaderButton
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.DESCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="createdAt"
                    title="Sent"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th className="small">Sent</th>}
              {showSortableHeaders && (
                <th>
                  <SortableColumnHeaderButton
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
                    sortField="subject"
                    title="Message"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th>Message</th>}
              <th>Case Title</th>
              <th>Case Status</th>
              <th>To</th>
              <th className="small">Section</th>
            </tr>
          </thead>
          {formattedMessages.messages.map(message => {
            return (
              <tbody key={`message-${message.messageId}`}>
                <tr>
                  <td className="consolidated-case-column">
                    {message.inConsolidatedGroup && (
                      <span
                        className="fa-layers fa-fw"
                        title={message.consolidatedIconTooltipText}
                      >
                        <Icon
                          aria-label={message.consolidatedIconTooltipText}
                          className="fa-icon-blue"
                          icon="copy"
                        />
                        {message.inLeadCase && (
                          <span className="fa-inverse lead-case-icon-text">
                            L
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="message-queue-row small" colSpan="2">
                    {message.docketNumberWithSuffix}
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row message-subject">
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
                  <td className="message-queue-row small">
                    {message.toSection}
                  </td>
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

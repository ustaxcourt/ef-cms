import { Button } from '../../ustc-ui/Button/Button';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { TableFilters } from '../../ustc-ui/TableFilters/TableFilters';
import { applicationContext } from '../../applicationContext';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const {
  ALPHABETICALLY_ASCENDING,
  ALPHABETICALLY_DESCENDING,
  ASCENDING,
  CHRONOLOGICALLY_ASCENDING,
  CHRONOLOGICALLY_DESCENDING,
  DESCENDING,
} = applicationContext.getConstants();

export const MessagesSectionCompleted = connect(
  {
    completedByUsers: state.formattedMessages.completedByUsers,
    completedMessages: state.formattedMessages.completedMessages,
    hasMessages: state.formattedMessages.hasMessages,
    screenMetadata: state.screenMetadata,
    showFilters: state.formattedMessages.showFilters,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionCompleted({
    completedByUsers,
    completedMessages,
    hasMessages,
    screenMetadata,
    showFilters,
    showSortableHeaders,
    sortMessagesSequence,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        {showFilters && (
          <TableFilters
            filters={[
              {
                isSelected: screenMetadata.completedBy,
                key: 'completedBy',
                label: 'Completed By',
                options: completedByUsers,
              },
            ]}
            onSelect={updateScreenMetadataSequence}
          ></TableFilters>
        )}

        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              {showSortableHeaders && (
                <th aria-label="Docket Number" className="small" colSpan="2">
                  <SortableColumnHeaderButton
                    ascText={CHRONOLOGICALLY_ASCENDING}
                    defaultSort={DESCENDING}
                    descText={CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
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
                <th className="medium">
                  <SortableColumnHeaderButton
                    ascText={CHRONOLOGICALLY_ASCENDING}
                    defaultSort={ASCENDING}
                    descText={CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="completedAt"
                    title="Completed"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th className="medium">Completed</th>}
              {showSortableHeaders && (
                <th>
                  <SortableColumnHeaderButton
                    ascText={ALPHABETICALLY_ASCENDING}
                    defaultSort={ASCENDING}
                    descText={ALPHABETICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="subject"
                    title="Last Message"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th>Message</th>}
              <th>Comment</th>
              <th>Completed by</th>
              <th>Section</th>
            </tr>
          </thead>
          {completedMessages.map(message => (
            <CompletedMessageRow
              completedAtFormatted={message.completedAtFormatted}
              completedBy={message.completedBy}
              completedBySection={message.completedBySection}
              completedMessage={message.completedMessage}
              docketNumberWithSuffix={message.docketNumberWithSuffix}
              key={message.messageId}
              message={message.message}
              messageDetailLink={message.messageDetailLink}
              subject={message.subject}
            />
          ))}
        </table>
        {!hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

const CompletedMessageRow = React.memo(function CompletedMessageRow({
  completedAtFormatted,
  completedBy,
  completedBySection,
  completedMessage,
  docketNumberWithSuffix,
  message,
  messageDetailLink,
  subject,
}) {
  return (
    <tbody>
      <tr>
        <td aria-hidden="true" className="focus-toggle" />
        <td className="message-queue-row small">{docketNumberWithSuffix}</td>
        <td className="message-queue-row small">
          <span className="no-wrap">{completedAtFormatted}</span>
        </td>
        <td className="message-queue-row">
          <div className="message-document-title">
            <Button link className="padding-0" href={messageDetailLink}>
              {subject}
            </Button>
          </div>

          <div className="message-document-detail">{message}</div>
        </td>
        <td className="message-queue-row">{completedMessage}</td>
        <td className="message-queue-row">{completedBy}</td>
        <td className="message-queue-row">{completedBySection}</td>
      </tr>
    </tbody>
  );
});

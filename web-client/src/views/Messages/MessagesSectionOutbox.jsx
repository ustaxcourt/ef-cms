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

export const MessagesSectionOutbox = connect(
  {
    caseStatuses: state.formattedMessages.caseStatuses,
    formattedMessages: state.formattedMessages.messages,
    fromUsers: state.formattedMessages.fromUsers,
    hasMessages: state.formattedMessages.hasMessages,
    screenMetadata: state.screenMetadata,
    showFilters: state.formattedMessages.showFilters,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
    toSections: state.formattedMessages.toSections,
    toUsers: state.formattedMessages.toUsers,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionOutbox({
    caseStatuses,
    formattedMessages,
    fromUsers,
    hasMessages,
    screenMetadata,
    showFilters,
    showSortableHeaders,
    sortMessagesSequence,
    toSections,
    toUsers,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        {showFilters && (
          <TableFilters
            filters={[
              {
                isSelected: screenMetadata.caseStatus,
                key: 'caseStatus',
                label: 'Case Status',
                options: caseStatuses,
              },
              {
                isSelected: screenMetadata.toUser,
                key: 'toUser',
                label: 'To',
                options: toUsers,
              },
              {
                isSelected: screenMetadata.fromUser,
                key: 'fromUser',
                label: 'From',
                options: fromUsers,
              },
              {
                isSelected: screenMetadata.toSection,
                key: 'toSection',
                label: 'Section',
                options: toSections,
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
                <th className="small">
                  <SortableColumnHeaderButton
                    ascText={CHRONOLOGICALLY_ASCENDING}
                    defaultSort={DESCENDING}
                    descText={CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
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
                    ascText={ALPHABETICALLY_ASCENDING}
                    defaultSort={ASCENDING}
                    descText={ALPHABETICALLY_DESCENDING}
                    hasRows={hasMessages}
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
              <th>From</th>
              <th>Section</th>
            </tr>
          </thead>
          {formattedMessages.map(message => (
            <MessageOutboxRow
              caseStatus={message.caseStatus}
              caseTitle={message.caseTitle}
              createdAtFormatted={message.createdAtFormatted}
              docketNumberWithSuffix={message.docketNumberWithSuffix}
              from={message.from}
              key={message.messageId}
              message={message.message}
              messageDetailLink={message.messageDetailLink}
              messageId={message.messageId}
              subject={message.subject}
              to={message.to}
              toSection={message.toSection}
            />
          ))}
        </table>
        {!hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

const MessageOutboxRow = React.memo(function MessageOutboxRow({
  caseStatus,
  caseTitle,
  createdAtFormatted,
  docketNumberWithSuffix,
  from,
  message,
  messageDetailLink,
  subject,
  to,
  toSection,
}) {
  return (
    <tbody>
      <tr>
        <td aria-hidden="true" className="focus-toggle" />
        <td className="message-queue-row small">{docketNumberWithSuffix}</td>
        <td className="message-queue-row small">
          <span className="no-wrap">{createdAtFormatted}</span>
        </td>
        <td className="message-queue-row message-subject">
          <div className="message-document-title">
            <Button link className="padding-0" href={messageDetailLink}>
              {subject}
            </Button>
          </div>

          <div className="message-document-detail">{message}</div>
        </td>
        <td className="message-queue-row max-width-25">{caseTitle}</td>
        <td className="message-queue-row">{caseStatus}</td>
        <td className="message-queue-row to">{to}</td>
        <td className="message-queue-row from">{from}</td>
        <td className="message-queue-row small">{toSection}</td>
      </tr>
    </tbody>
  );
});

import { Button } from '../../ustc-ui/Button/Button';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { TableFilters } from '../../ustc-ui/TableFilters/TableFilters';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionInbox = connect(
  {
    caseStatuses: state.formattedMessages.caseStatuses,
    constants: state.constants,
    formattedMessages: state.formattedMessages.messages,
    fromSections: state.formattedMessages.fromSections,
    fromUsers: state.formattedMessages.fromUsers,
    hasMessages: state.formattedMessages.hasMessages,
    screenMetadata: state.screenMetadata,
    showFilters: state.formattedMessages.showFilters,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
    toUsers: state.formattedMessages.toUsers,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionInbox({
    caseStatuses,
    constants,
    formattedMessages,
    fromSections,
    fromUsers,
    hasMessages,
    screenMetadata,
    showFilters,
    showSortableHeaders,
    sortMessagesSequence,
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
                isSelected: screenMetadata.fromSection,
                key: 'fromSection',
                label: 'Section',
                options: fromSections,
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
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="createdAt"
                    title="Received"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th className="small">Received</th>}
              {showSortableHeaders && (
                <th>
                  <SortableColumnHeaderButton
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
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
              <th className="small">Section</th>
            </tr>
          </thead>
          {formattedMessages.map(message => (
            <MessageInboxRow
              caseStatus={message.caseStatus}
              caseTitle={message.caseTitle}
              createdAtFormatted={message.createdAtFormatted}
              docketNumberWithSuffix={message.docketNumberWithSuffix}
              from={message.from}
              fromSection={message.fromSection}
              inConsolidatedGroup={message.inConsolidatedGroup}
              inLeadCase={message.inLeadCase}
              key={message.messageId}
              message={message.message}
              messageDetailLink={message.messageDetailLink}
              messageId={message.messageId}
              subject={message.subject}
              to={message.to}
            />
          ))}
        </table>
        {!hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

const MessageInboxRow = React.memo(function MessageInboxRow({
  caseStatus,
  caseTitle,
  createdAtFormatted,
  docketNumberWithSuffix,
  from,
  fromSection,
  inConsolidatedGroup,
  inLeadCase,
  message,
  messageDetailLink,
  subject,
  to,
}) {
  return (
    <tbody>
      <tr>
        <td className="consolidated-case-column">
          {inConsolidatedGroup && (
            <span className="fa-layers fa-fw">
              <Icon
                aria-label="consolidated case"
                className="fa-icon-blue"
                icon="copy"
              />
              {inLeadCase && (
                <span className="fa-inverse lead-case-icon-text">L</span>
              )}
            </span>
          )}
        </td>
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
        <td className="message-queue-row small">{fromSection}</td>
      </tr>
    </tbody>
  );
});

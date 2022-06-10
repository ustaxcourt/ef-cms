import { Button } from '../../ustc-ui/Button/Button';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { TableFilters } from '../../ustc-ui/TableFilters/TableFilters';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionCompleted = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionCompleted({
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
                isSelected: screenMetadata.completedBy,
                key: 'completedBy',
                label: 'Completed By',
                options: formattedMessages.completedByUsers,
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
                <th className="medium">
                  <SortableColumnHeaderButton
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
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
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={formattedMessages.hasMessages}
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
          {formattedMessages.completedMessages.map(message => (
            <CompletedMessageRow
              completedAtFormatted={message.completedAtFormatted}
              completedBy={message.completedBy}
              completedBySection={message.completedBySection}
              completedMessage={message.completedMessage}
              consolidatedIconTooltipText={message.consolidatedIconTooltipText}
              docketNumberWithSuffix={message.docketNumberWithSuffix}
              inConsolidatedGroup={message.inConsolidatedGroup}
              inLeadCase={message.inLeadCase}
              key={message.messageId}
              message={message.message}
              messageDetailLink={message.messageDetailLink}
              subject={message.subject}
            />
          ))}
        </table>
        {!formattedMessages.hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

const CompletedMessageRow = React.memo(function CompletedMessageRow({
  completedAtFormatted,
  completedBy,
  completedBySection,
  completedMessage,
  consolidatedIconTooltipText,
  docketNumberWithSuffix,
  inConsolidatedGroup,
  inLeadCase,
  message,
  messageDetailLink,
  subject,
}) {
  return (
    <tbody>
      <tr>
        <td className="consolidated-case-column">
          {inConsolidatedGroup && (
            <span
              className="fa-layers fa-fw"
              title={consolidatedIconTooltipText}
            >
              <Icon
                aria-label={consolidatedIconTooltipText}
                className="fa-icon-blue"
                icon="copy"
              />
              {inLeadCase && (
                <span className="fa-inverse lead-case-icon-text">L</span>
              )}
            </span>
          )}
        </td>
        <td className="message-queue-row small" colSpan="2">
          {docketNumberWithSuffix}
        </td>
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

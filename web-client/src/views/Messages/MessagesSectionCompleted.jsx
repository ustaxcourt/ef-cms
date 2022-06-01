import {
  ALPHABETICALLY_ASCENDING,
  ALPHABETICALLY_DESCENDING,
  CHRONOLOGICALLY_ASCENDING,
  CHRONOLOGICALLY_DESCENDING,
} from './sortConstants';
import { ASCENDING, DESCENDING } from '../../presenter/presenterConstants';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionCompleted = connect(
  {
    completedMessages: state.formattedMessages.completedMessages,
    showSortableHeaders: state.showSortableHeaders,
    sortSectionMessagesSequence: sequences.sortSectionMessagesSequence,
  },
  function MessagesSectionCompleted({
    completedMessages,
    showSortableHeaders,
    sortSectionMessagesSequence,
  }) {
    const hasMessages = completedMessages.length > 0;
    return (
      <>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              {showSortableHeaders && (
                <th aria-label="Docket Number" className="small" colSpan="2">
                  <SortableColumnHeaderButton
                    ascText={CHRONOLOGICALLY_ASCENDING}
                    defaultSort={DESCENDING}
                    descText={CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="docketNumber"
                    title="Docket No."
                    onClickSequence={sortSectionMessagesSequence}
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
                    onClickSequence={sortSectionMessagesSequence}
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
                    onClickSequence={sortSectionMessagesSequence}
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
        <td className="consolidated-case-column">
          {message.inConsolidatedGroup && (
            <FontAwesomeIcon className="fa-icon-blue" icon="copy" />
          )}
        </td>
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

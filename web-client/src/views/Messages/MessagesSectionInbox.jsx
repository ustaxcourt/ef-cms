import {
  ALPHABETICALLY_ASCENDING,
  ALPHABETICALLY_DESCENDING,
  CHRONOLOGICALLY_ASCENDING,
  CHRONOLOGICALLY_DESCENDING,
} from './sortConstants';
import { ASCENDING, DESCENDING } from '../../presenter/presenterConstants';
import { Button } from '../../ustc-ui/Button/Button';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionInbox = connect(
  {
    formattedMessages: state.formattedMessages.messages,
    hasMessages: state.formattedMessages.hasMessages,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
  },
  function MessagesSectionInbox({
    formattedMessages,
    hasMessages,
    showSortableHeaders,
    sortMessagesSequence,
  }) {
    return (
      <>
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
  message,
  messageDetailLink,
  subject,
  to,
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
        <td className="message-queue-row small">{fromSection}</td>
      </tr>
    </tbody>
  );
});

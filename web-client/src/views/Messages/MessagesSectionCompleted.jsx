import { Button } from '../../ustc-ui/Button/Button';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionCompleted = connect(
  {
    formattedMessages: state.formattedMessages.completedMessages,
    sortSectionMessagesSequence: sequences.sortSectionMessagesSequence,
    tableSort: state.tableSort,
  },
  function MessagesSectionCompleted({
    formattedMessages,
    sortSectionMessagesSequence,
    tableSort,
  }) {
    return (
      <>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                <SortableColumnHeaderButton
                  defaultSort="desc"
                  sortField="docketNumber"
                  tableSort={tableSort}
                  title="Docket No."
                  onClickSequence={sortSectionMessagesSequence}
                />
              </th>
              <th className="medium">
                <SortableColumnHeaderButton
                  defaultSort="asc"
                  sortField="completedAt"
                  tableSort={tableSort}
                  title="Completed"
                  onClickSequence={sortSectionMessagesSequence}
                />
              </th>

              <th>
                <SortableColumnHeaderButton
                  defaultSort="desc"
                  sortField="subject"
                  tableSort={tableSort}
                  title="Last Message"
                  onClickSequence={sortSectionMessagesSequence}
                />
              </th>
              <th>Comment</th>
              <th>Completed by</th>
              <th>Section</th>
            </tr>
          </thead>
          {formattedMessages.map(message => {
            return (
              <tbody key={message.messageId}>
                <tr key={message.messageId}>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row small">
                    {message.docketNumberWithSuffix}
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">
                      {message.completedAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row">
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
                  <td className="message-queue-row">
                    {message.completedMessage}
                  </td>
                  <td className="message-queue-row">{message.completedBy}</td>
                  <td className="message-queue-row">
                    {message.completedBySection}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedMessages.length === 0 && <div>There are no messages.</div>}
      </>
    );
  },
);

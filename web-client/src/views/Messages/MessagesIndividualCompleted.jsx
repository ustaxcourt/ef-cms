import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MessagesIndividualCompleted = connect(
  { formattedMessages: state.formattedMessages.completedMessages },
  function MessagesIndividualCompleted({ formattedMessages }) {
    return (
      <>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                Docket No.
              </th>
              <th className="small">Completed</th>
              <th>Last Message</th>
              <th>Comment</th>
              <th>Case Title</th>
            </tr>
          </thead>
          {formattedMessages.map(message => {
            return (
              <tbody key={`message-individual-${message.messageId}`}>
                <tr>
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
                  <td className="message-queue-row">{message.caseTitle}</td>
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

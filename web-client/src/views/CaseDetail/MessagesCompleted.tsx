import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const MessagesCompleted = connect(
  {
    formattedCompletedMessages: state.formattedCaseMessages.completedMessages,
  },
  function MessagesCompleted({ formattedCompletedMessages }) {
    return (
      <>
        {formattedCompletedMessages.length === 0 && (
          <p className="margin-bottom-10">There are no messages.</p>
        )}
        {formattedCompletedMessages.length > 0 && (
          <table className="usa-table row-border-only subsection messages">
            <thead>
              <tr>
                <th className="header-fixed-width">Completed</th>
                <th className="header-fixed-width">Last Message</th>
                <th className="header-fixed-width">Comment</th>
                <th>Completed By</th>
                <th>Section</th>
              </tr>
            </thead>

            <tbody>
              {formattedCompletedMessages.map(message => (
                <tr key={message.messageId}>
                  <td className="responsive-title padding-extra">
                    {message.completedAtFormatted}
                  </td>
                  <td className="padding-extra">
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
                  <td className="padding-extra">{message.completedMessage}</td>
                  <td className="padding-extra">{message.completedBy}</td>
                  <td>{message.completedBySection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  },
);

MessagesCompleted.displayName = 'MessagesCompleted';

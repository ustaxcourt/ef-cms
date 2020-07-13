import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessagesCompleted = connect(
  {
    formattedCompletedMessages: state.formattedCaseMessages.completedMessages,
  },
  function CaseMessagesCompleted({ formattedCompletedMessages }) {
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
                <th>Completed by</th>
                <th>Section</th>
              </tr>
            </thead>

            <tbody>
              {formattedCompletedMessages.map((message, idx) => (
                <tr key={idx}>
                  <td className="responsive-title padding-extra">
                    {message.completedAtFormatted}
                  </td>
                  <td className="padding-extra">
                    <div className="message-document-title">
                      <Button
                        link
                        className="padding-0"
                        href={`/case-messages/${message.docketNumber}/message-detail/${message.parentMessageId}`}
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

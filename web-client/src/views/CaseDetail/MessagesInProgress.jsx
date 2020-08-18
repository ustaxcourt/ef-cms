import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MessagesInProgress = connect(
  {
    formattedInProgressMessages: state.formattedCaseMessages.inProgressMessages,
  },
  function MessagesInProgress({ formattedInProgressMessages }) {
    return (
      <>
        {formattedInProgressMessages.length === 0 && (
          <p className="margin-bottom-10">There are no messages.</p>
        )}
        {formattedInProgressMessages.length > 0 && (
          <table className="usa-table row-border-only subsection messages">
            <thead>
              <tr>
                <th className="header-fixed-width">To</th>
                <th className="header-fixed-width">From</th>
                <th className="header-fixed-width">Received</th>
                <th>Message</th>
              </tr>
            </thead>

            <tbody>
              {formattedInProgressMessages.map((message, idx) => (
                <tr key={idx}>
                  <td className="responsive-title padding-extra">
                    {message.to}
                  </td>
                  <td className="padding-extra">{message.from}</td>
                  <td className="padding-extra">
                    <span className="no-wrap">
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="padding-extra">
                    <div className="message-document-title">
                      <Button
                        link
                        className="padding-0"
                        href={`/messages/${message.docketNumber}/message-detail/${message.parentMessageId}`}
                      >
                        {message.subject}
                      </Button>
                    </div>

                    <div className="message-document-detail">
                      {message.message}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  },
);

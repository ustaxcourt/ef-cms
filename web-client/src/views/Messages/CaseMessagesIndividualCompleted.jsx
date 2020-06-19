import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessagesIndividualCompleted = connect(
  { formattedMessages: state.formattedMessages },
  function CaseMessagesIndividualInbox({ formattedMessages }) {
    return (
      <>
        <table className="usa-table work-queue subsection">
          <thead>
            <tr>
              <th className="small" colSpan="2">
                Docket Number
              </th>
              <th className="small">Completed</th>
              <th>Last Message</th>
              <th>Comment</th>
            </tr>
          </thead>
          {formattedMessages.map((message, idx) => {
            return (
              <tbody key={idx}>
                <tr key={idx}>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row small">
                    <CaseLink formattedCase={message} />
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">{message.completedAt}</span>
                  </td>
                  <td className="message-queue-row">{message.message}</td>
                  <td className="message-queue-row">
                    {message.completedMessage}
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

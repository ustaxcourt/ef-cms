import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessagesSectionOutbox = connect(
  { formattedMessages: state.formattedMessages },
  function CaseMessagesIndividualInbox({ formattedMessages }) {
    return (
      <>
        <table className="usa-table work-queue subsection">
          <thead>
            <tr>
              <th>Docket</th>
              <th>Sent</th>
              <th>Message</th>
              <th>Case Status</th>
              <th>To</th>
              <th>From</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {formattedMessages.map((message, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <CaseLink formattedCase={message} />
                  </td>
                  <td>{message.createdAtFormatted}</td>
                  <td>
                    <Button
                      link
                      href={`/case-messages/${message.docketNumber}/message-detail/${message.messageId}`}
                    >
                      {message.subject}
                    </Button>
                    <div>{message.message}</div>
                  </td>
                  <td>{message.caseStatus}</td>
                  <td>{message.to}</td>
                  <td>{message.from}</td>
                  <td>{message.fromSection}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {formattedMessages.length === 0 && <div>There are no messages.</div>}
      </>
    );
  },
);

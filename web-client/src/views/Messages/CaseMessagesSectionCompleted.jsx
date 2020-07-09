import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessagesSectionCompleted = connect(
  { formattedMessages: state.formattedMessages.completedMessages },
  function CaseMessagesSectionCompleted({ formattedMessages }) {
    return (
      <>
        <table className="usa-table work-queue subsection">
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                Docket No.
              </th>
              <th className="small">Completed</th>
              <th>Last Message</th>
              <th>Comment</th>
              <th>Completed by</th>
              <th>Section</th>
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
                    <span className="no-wrap">
                      {message.completedAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row">
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

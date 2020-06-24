import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { CaseMessagesRowAttachments } from './CaseMessagesRowAttachments';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessagesIndividualOutbox = connect(
  { formattedMessages: state.formattedMessages.messages },
  function CaseMessagesIndividualInbox({ formattedMessages }) {
    return (
      <>
        <table className="usa-table work-queue subsection">
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                Docket No.
              </th>
              <th className="small">Sent</th>
              <th>Message</th>
              <th>Case Title</th>
              <th>Case Status</th>
              <th>To</th>
              <th className="small">Section</th>
              <th>Attachments</th>
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
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row message-queue-document message-subject">
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
                  <td className="message-queue-row">{message.caseTitle}</td>
                  <td className="message-queue-row">{message.caseStatus}</td>
                  <td className="message-queue-row to">{message.to}</td>
                  <td className="message-queue-row small">
                    {message.toSection}
                  </td>
                  <td>
                    {message.attachments.length === 0 && (
                      <span>No attachments</span>
                    )}
                    {message.attachments.length > 0 && (
                      <CaseMessagesRowAttachments
                        attachments={message.attachments}
                        caseId={message.caseId}
                      />
                    )}
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

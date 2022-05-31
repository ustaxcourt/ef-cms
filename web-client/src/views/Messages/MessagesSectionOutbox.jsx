import { Button } from '../../ustc-ui/Button/Button';
import { TableFilters } from '../../ustc-ui/TableFilters/TableFilters';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionOutbox = connect(
  {
    caseStatuses: state.formattedMessages.caseStatuses,
    formattedMessages: state.formattedMessages.messages,
    fromUsers: state.formattedMessages.fromUsers,
    screenMetadata: state.screenMetadata,
    showFilters: state.formattedMessages.showFilters,
    toSections: state.formattedMessages.toSections,
    toUsers: state.formattedMessages.toUsers,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionOutbox({
    caseStatuses,
    formattedMessages,
    fromUsers,
    screenMetadata,
    showFilters,
    toSections,
    toUsers,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        {showFilters && (
          <TableFilters
            filters={[
              {
                isSelected: screenMetadata.caseStatus,
                key: 'caseStatus',
                label: 'Case Status',
                options: caseStatuses,
              },
              {
                isSelected: screenMetadata.toUser,
                key: 'toUser',
                label: 'To',
                options: toUsers,
              },
              {
                isSelected: screenMetadata.fromUser,
                key: 'fromUser',
                label: 'From',
                options: fromUsers,
              },
              {
                isSelected: screenMetadata.toSection,
                key: 'toSection',
                label: 'Section',
                options: toSections,
              },
            ]}
            onSelect={updateScreenMetadataSequence}
          ></TableFilters>
        )}
        <table className="usa-table ustc-table subsection">
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
              <th>From</th>
              <th>Section</th>
            </tr>
          </thead>
          {formattedMessages.map(message => {
            return (
              <tbody key={message.messageId}>
                <tr>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row small">
                    {message.docketNumberWithSuffix}
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row message-subject">
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
                  <td className="message-queue-row max-width-25">
                    {message.caseTitle}
                  </td>
                  <td className="message-queue-row">{message.caseStatus}</td>
                  <td className="message-queue-row to">{message.to}</td>
                  <td className="message-queue-row from">{message.from}</td>
                  <td className="message-queue-row small">
                    {message.toSection}
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

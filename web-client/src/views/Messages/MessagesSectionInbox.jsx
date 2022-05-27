import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessagesSectionInbox = connect(
  {
    caseStatuses: state.formattedMessages.caseStatuses,
    formattedMessages: state.formattedMessages.messages,
    fromSections: state.formattedMessages.fromSections,
    fromUsers: state.formattedMessages.fromUsers,
    toUsers: state.formattedMessages.toUsers,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesSectionInbox({
    caseStatuses,
    formattedMessages,
    fromSections,
    fromUsers,
    toUsers,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        <div className="grid-row margin-bottom-3">
          <div className="grid-row grid-col-10">
            <div className="grid-col-1 padding-top-05 margin-right-3">
              <h3 id="filterHeading">Filter by</h3>
            </div>
            <TableFilters
              filters={[
                {
                  key: 'caseStatus',
                  label: 'Case Status',
                  options: caseStatuses,
                },
                {
                  key: 'toUser',
                  label: 'To',
                  options: toUsers,
                },
                {
                  key: 'fromUser',
                  label: 'From',
                  options: fromUsers,
                },
                {
                  key: 'section',
                  label: 'Section',
                  options: fromSections,
                },
              ]}
              onSelect={updateScreenMetadataSequence}
            ></TableFilters>
          </div>
        </div>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                Docket No.
              </th>
              <th className="small">Received</th>
              <th>Message</th>
              <th>Case Title</th>
              <th>Case Status</th>
              <th>To</th>
              <th>From</th>
              <th className="small">Section</th>
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
                    {message.fromSection}
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

const TableFilters = ({ filters, onSelect }) => {
  return (
    <div className="grid-row grid-col-10 grid-gap padding-left-2">
      {filters.map(({ key, label, options }) => {
        return (
          <div className="grid-col-3" key={key}>
            <select
              aria-label={key}
              bind={`screenMetadata.${key}`}
              className="usa-select"
              id={`${key}Filter`}
              name={key}
              value={filters[key]}
              onChange={e => {
                onSelect({
                  key,
                  value: e.target.value,
                });
              }}
            >
              <option value="">-{label}-</option>
              {options.map(from => (
                <option key={from} value={from}>
                  {from}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

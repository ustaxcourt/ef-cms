import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MessagesSectionInbox = connect(
  {
    caseStatuses: state.formattedMessages.caseStatuses,
    // completedByUsers: state.formattedMessages.completedByUsers,
    formattedMessages: state.formattedMessages.messages,
    // fromUsers: state.formattedMessages.fromUsers,
    // sections: state.formattedMessages.sections,
  },
  function MessagesSectionInbox({
    // completedByUsers,
    caseStatuses,
    formattedMessages,
  }) {
    return (
      <>
        <div className="grid-row margin-bottom-3">
          <div className="grid-row grid-col-10">
            <div className="grid-col-1 padding-top-05 margin-right-3">
              <h3 id="filterHeading">Filter by</h3>
            </div>
            <TableFilters
              filters={[{ key: 'caseStatus', options: caseStatuses }]}
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

const TableFilters = ({ filters }) => {
  return (
    <div className="grid-row grid-col-10 grid-gap padding-left-2">
      {filters.map(({ key, options }) => {
        return (
          <div className="grid-col-3" key={key}>
            <BindedSelect
              aria-label="from"
              bind="screenMetadata.filters.from"
              id="fromFilter"
              name="from"
            >
              <option value="">-From-</option>
              {options.map(from => (
                <option key={from} value={from}>
                  {from}
                </option>
              ))}
            </BindedSelect>
          </div>
        );
      })}
    </div>
  );
};

import { Button } from '../../ustc-ui/Button/Button';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { TableFilters } from '../../ustc-ui/TableFilters/TableFilters';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const MessagesIndividualInbox = connect(
  {
    caseStatuses: state.formattedMessages.caseStatuses,
    constants: state.constants,
    formattedMessages: state.formattedMessages.messages,
    fromSections: state.formattedMessages.fromSections,
    fromUsers: state.formattedMessages.fromUsers,
    hasMessages: state.formattedMessages.hasMessages,
    screenMetadata: state.screenMetadata,
    showFilters: state.formattedMessages.showFilters,
    showSortableHeaders: state.showSortableHeaders,
    sortMessagesSequence: sequences.sortMessagesSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesIndividualInbox({
    caseStatuses,
    constants,
    formattedMessages,
    fromSections,
    fromUsers,
    hasMessages,
    screenMetadata,
    showFilters,
    showSortableHeaders,
    sortMessagesSequence,
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
                isSelected: screenMetadata.fromUser,
                key: 'fromUser',
                label: 'From',
                options: fromUsers,
              },
              {
                isSelected: screenMetadata.fromSection,
                key: 'fromSection',
                label: 'Section',
                options: fromSections,
              },
            ]}
            onSelect={updateScreenMetadataSequence}
          ></TableFilters>
        )}
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              {showSortableHeaders && (
                <th aria-label="Docket Number" className="small" colSpan="2">
                  <SortableColumnHeaderButton
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.DESCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="docketNumber"
                    title="Docket No."
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && (
                <th aria-label="Docket Number" className="small" colSpan="2">
                  Docket No.
                </th>
              )}
              {showSortableHeaders && (
                <th className="medium">
                  <SortableColumnHeaderButton
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="createdAt"
                    title="Received"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th className="small">Received</th>}
              <th className="message-unread-column"></th>
              {showSortableHeaders && (
                <th>
                  <SortableColumnHeaderButton
                    ascText={constants.ALPHABETICALLY_ASCENDING}
                    defaultSort={constants.ASCENDING}
                    descText={constants.ALPHABETICALLY_DESCENDING}
                    hasRows={hasMessages}
                    sortField="subject"
                    title="Message"
                    onClickSequence={sortMessagesSequence}
                  />
                </th>
              )}
              {!showSortableHeaders && <th>Message</th>}
              <th>Case Title</th>
              <th>Case Status</th>
              <th>From</th>
              <th className="small">Section</th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          {formattedMessages.map(message => {
            return (
              <tbody key={message.messageId}>
                <tr key={message.messageId}>
                  <td className="consolidated-case-column">
                    {message.inConsolidatedGroup && (
                      <span className="fa-layers fa-fw">
                        <Icon
                          aria-label={message.consolidatedIconTooltipText}
                          className="fa-icon-blue"
                          icon="copy"
                        />
                        {message.inLeadCase && (
                          <span className="fa-inverse lead-case-icon-text">
                            L
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="message-queue-row small" colSpan="2">
                    {message.docketNumberWithSuffix}
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="message-unread-column">
                    {!message.isRead && (
                      <Icon
                        aria-label="unread message"
                        className="fa-icon-blue"
                        icon="envelope"
                        size="1x"
                      />
                    )}
                  </td>
                  <td className="message-queue-row message-subject">
                    <div className="message-document-title">
                      <Button
                        link
                        className={classNames(
                          'padding-0',
                          message.isRead ? '' : 'text-bold',
                        )}
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
                  <td className="message-queue-row from">{message.from}</td>
                  <td className="message-queue-row small">
                    {message.fromSection}
                  </td>
                  <td aria-hidden="true" />
                </tr>
              </tbody>
            );
          })}
        </table>
        {!hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

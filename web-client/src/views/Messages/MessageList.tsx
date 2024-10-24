import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { SuccessNotification } from '../SuccessNotification';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export interface MessageColumnData {
  columnName: string;
  sortField: string;
  sortType?: 'string' | 'date';
  className?: string;
  dataTestId?: string;
  iconClassName?: string;
}

export interface MessageFilterData {
  isSelected: any;
  key: string;
  label: string;
  options: any[];
}

type MessageListProps = {
  selectable: boolean;
  messageColumns: MessageColumnData[];
  messageFilters: MessageFilterData[];
};

const MessageListCerebralDependencies = {
  batchCompleteMessageSequence: sequences.batchCompleteMessageSequence,
  constants: state.constants,
  formattedMessages: state.formattedMessages,
  messagesIndividualInboxHelper: state.messagesIndividualInboxHelper,
  screenMetadata: state.screenMetadata,
  setSelectedMessagesSequence: sequences.setSelectedMessagesSequence,
  sortTableSequence: sequences.sortTableSequence,
  tableSort: state.tableSort,
  updateMessageFilterSequence: sequences.updateMessageFilterSequence,
};

export const MessageList = connect<
  MessageListProps,
  typeof MessageListCerebralDependencies
>(
  MessageListCerebralDependencies,
  function MessageList({
    batchCompleteMessageSequence,
    constants,
    formattedMessages,
    messageColumns,
    messageFilters,
    messagesIndividualInboxHelper,
    screenMetadata,
    selectable,
    setSelectedMessagesSequence,
    sortTableSequence,
    tableSort,
    updateMessageFilterSequence,
  }) {
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!selectAllCheckboxRef.current) return;

      selectAllCheckboxRef.current.indeterminate =
        messagesIndividualInboxHelper.someMessagesSelected &&
        !messagesIndividualInboxHelper.allMessagesSelected;
    }, [
      selectAllCheckboxRef.current,
      messagesIndividualInboxHelper.someMessagesSelected,
      messagesIndividualInboxHelper.allMessagesSelected,
    ]);
    return (
      <>
        <SuccessNotification />
        <ErrorNotification />
        {screenMetadata.completionSuccess && (
          <div
            aria-live="polite"
            className="usa-alert usa-alert--success"
            data-testid="message-detail-success-alert"
            role="alert"
          >
            <div className="usa-alert__body">
              Message(s) completed at{' '}
              {messagesIndividualInboxHelper.messagesCompletedAt} by{' '}
              {messagesIndividualInboxHelper.messagesCompletedBy}
            </div>
          </div>
        )}
        <div className="grid-row grid-gap">
          <div className="desktop:grid-col-8 tablet:grid-col-12 display-flex flex-align-center">
            <TableFilters
              filters={messageFilters}
              onSelect={updateMessageFilterSequence}
            ></TableFilters>
          </div>

          {selectable && (
            <div className="desktop:grid-col-4 tablet:grid-col-12 tablet:margin-top-2 text-right">
              <Button
                link
                className="action-button"
                data-testid="message-batch-mark-as-complete"
                disabled={
                  !messagesIndividualInboxHelper.isCompletionButtonEnabled
                }
                icon="check-circle"
                id="button-batch-complete"
                onClick={() => {
                  batchCompleteMessageSequence();
                }}
              >
                Complete
              </Button>
            </div>
          )}
        </div>

        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              {selectable && (
                <th>
                  <input
                    aria-label="all-messages-checkbox"
                    checked={messagesIndividualInboxHelper.allMessagesSelected}
                    data-testid="all-messages-checkbox"
                    disabled={
                      !messagesIndividualInboxHelper.allMessagesCheckboxEnabled
                    }
                    id="all-messages-checkbox"
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    onChange={() => {
                      const selectAll = formattedMessages.messages.map(
                        message => ({
                          messageId: message.messageId,
                          parentMessageId: message.parentMessageId,
                        }),
                      );
                      setSelectedMessagesSequence({ messages: selectAll });
                    }}
                  />
                </th>
              )}
              {messageColumns.map((data, index) => {
                return (
                  <>
                    {data.iconClassName && (
                      <th className={data.iconClassName}></th>
                    )}
                    <th
                      aria-label={data.columnName}
                      className={data.className}
                      colSpan={index === 0 ? 2 : undefined}
                      key={data.sortField}
                      // TODO: probably should use aria-sort, but USWDS has default styles for this we may not want
                    >
                      <SortableColumn
                        ascText={
                          data.sortType === 'string'
                            ? constants.CHRONOLOGICALLY_ASCENDING
                            : constants.ALPHABETICALLY_ASCENDING
                        }
                        currentlySortedField={tableSort.sortField}
                        currentlySortedOrder={tableSort.sortOrder}
                        data-testid={`${data.dataTestId}-header-button`}
                        defaultSortOrder={constants.DESCENDING}
                        descText={
                          data.sortType === 'date'
                            ? constants.CHRONOLOGICALLY_DESCENDING
                            : constants.ALPHABETICALLY_DESCENDING
                        }
                        hasRows={formattedMessages.hasMessages}
                        sortField={data.sortField}
                        title={data.columnName}
                        onClickSequence={sortTableSequence}
                      />
                    </th>
                  </>
                );
              })}
            </tr>
          </thead>
          {formattedMessages.messages.map(message => {
            return (
              <tbody key={message.messageId}>
                <tr key={message.messageId}>
                  {selectable && (
                    <td>
                      <input
                        aria-label={`${message.caseTitle}-${message.subject}-checkbox`}
                        checked={message.isSelected}
                        id={`${message.caseTitle}-message-checkbox`}
                        type="checkbox"
                        onChange={() => {
                          setSelectedMessagesSequence({
                            messages: [
                              {
                                messageId: message.messageId,
                                parentMessageId: message.parentMessageId,
                              },
                            ],
                          });
                        }}
                      />
                    </td>
                  )}
                  <td className="consolidated-case-column">
                    <ConsolidatedCaseIcon
                      consolidatedIconTooltipText={
                        message.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={message.inConsolidatedGroup}
                      showLeadCaseIcon={message.isLeadCase}
                    />
                  </td>
                  <td
                    className="message-queue-row small"
                    colSpan={2}
                    data-testid="individual-message-inbox-docket-number-cell"
                  >
                    {message.docketNumberWithSuffix}
                  </td>
                  <td
                    className="message-queue-row small"
                    data-testid="individual-message-inbox-received-at-cell"
                  >
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
                        data-testid="individual-message-inbox-subject-cell"
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
                    {message.fromSectionFormatted}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {!formattedMessages.hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

MessageList.displayName = 'MessageList';

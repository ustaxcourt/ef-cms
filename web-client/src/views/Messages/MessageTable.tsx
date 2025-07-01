import {
  ASCENDING,
  DESCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';
import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import {
  MessageColumnData,
  SORT_FIELDS,
} from '@web-client/views/Messages/MessageColumns';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { SuccessNotification } from '../SuccessNotification';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';

export interface MessageFilterData {
  isSelected: any;
  key: string;
  label: string;
  options: any[];
}

type MessageListProps = {
  id: string;
  selectable: boolean;
  messageColumns: MessageColumnData[];
  messageFilters: MessageFilterData[];
};

const MessageListCerebralDependencies = {
  batchCompleteMessageSequence: sequences.batchCompleteMessageSequence,
  formattedMessages: state.formattedMessages,
  messagesIndividualInboxHelper: state.messagesIndividualInboxHelper,
  screenMetadata: state.screenMetadata,
  setSelectedMessagesSequence: sequences.setSelectedMessagesSequence,
  sortTableSequence: sequences.sortTableSequence,
  tableSort: state.tableSort,
  updateMessageFilterSequence: sequences.updateMessageFilterSequence,
};

export const MessageTable = connect<
  MessageListProps,
  typeof MessageListCerebralDependencies
>(
  MessageListCerebralDependencies,
  function MessageTable({
    batchCompleteMessageSequence,
    formattedMessages,
    id,
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

    // For cases when messages can be selected in the given view
    const getSelectAllCheckbox = () => {
      return (
        <th>
          <input
            aria-label="all-messages-checkbox"
            checked={messagesIndividualInboxHelper.allMessagesSelected}
            data-testid="all-messages-checkbox"
            disabled={!messagesIndividualInboxHelper.allMessagesCheckboxEnabled}
            id="all-messages-checkbox"
            ref={selectAllCheckboxRef}
            type="checkbox"
            onChange={() => {
              const selectAll = formattedMessages.messages.map(message => ({
                messageId: message.messageId,
                parentMessageId: message.parentMessageId,
              }));
              setSelectedMessagesSequence({ messages: selectAll });
            }}
          />
        </th>
      );
    };

    // For cases when messages can be completed in the given view
    const getCompleteAllButton = () => {
      return (
        <div className="desktop:grid-col-auto tablet:grid-col-12 tablet:margin-top-1 text-right desktop:margin-left-auto">
          <Button
            noMargin={true}
            link
            className="action-button tablet:margin-right-0"
            data-testid="message-batch-mark-as-complete"
            disabled={!messagesIndividualInboxHelper.isCompletionButtonEnabled}
            icon="check-circle"
            id="button-batch-complete"
            onClick={() => {
              batchCompleteMessageSequence();
            }}
          >
            Complete
          </Button>
        </div>
      );
    };

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
              <p className="usa-alert__text">
                Message(s) completed at{' '}
                {messagesIndividualInboxHelper.messagesCompletedAt} by{' '}
                {messagesIndividualInboxHelper.messagesCompletedBy}
              </p>
            </div>
          </div>
        )}
        <div className="grid-row grid-gap">
          {messageFilters.length > 0 && (
            <div
              className={
                selectable
                  ? 'desktop:grid-col-8 tablet:grid-col-12 display-flex flex-align-center' // To take into account the Complete All button
                  : undefined
              }
            >
              <TableFilters
                filters={messageFilters}
                onSelect={updateMessageFilterSequence}
              ></TableFilters>
            </div>
          )}
          {selectable && getCompleteAllButton()}
          <NonMobile>
            <div
              className={`text-semibold desktop:grid-col-auto tablet:padding-bottom-1 text-right tablet:grid-col-12 ${selectable ? '' : 'margin-left-auto'} ${messageFilters.length ? ' margin-top-auto margin-bottom-auto' : 'margin-bottom-2'}`}
            >
              Count:{' '}
              <span className="text-normal">
                {messagesIndividualInboxHelper.messagesDisplayedCount}
              </span>
            </div>
          </NonMobile>
          <Mobile>
            <div className="text-semibold text-right grid-col-12 margin-bottom-3">
              Count:{' '}
              <span className="text-normal">
                {messagesIndividualInboxHelper.messagesDisplayedCount}
              </span>
            </div>
          </Mobile>
        </div>
        <div className="overflow-x-auto overflow-y-hidden" id={id}>
          <table className="usa-table ustc-table subsection">
            <thead>
              <tr>
                {selectable && getSelectAllCheckbox()}
                {messageColumns.map(columnData => {
                  return (
                    <MessageColumnHeader
                      columnData={columnData}
                      formattedMessages={formattedMessages}
                      key={columnData.sortFieldInfo.sortField}
                      messageListId={id}
                      tableSort={tableSort}
                      onSort={sortTableSequence}
                    />
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {formattedMessages.messages.map(message => {
                return (
                  <MessageRow
                    columns={messageColumns}
                    key={message.messageId}
                    message={message}
                    messageListId={id}
                    selectable={selectable}
                    onSelect={setSelectedMessagesSequence}
                  />
                );
              })}
            </tbody>
          </table>
          {!formattedMessages.hasMessages && <div>There are no messages.</div>}
        </div>
      </>
    );
  },
);

const MessageColumnHeader = ({
  columnData,
  formattedMessages,
  messageListId,
  onSort,
  tableSort,
}: {
  messageListId: string;
  columnData: MessageColumnData;
  tableSort: any;
  formattedMessages: any;
  onSort: ({
    sortField,
    sortOrder,
  }: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
}) => {
  return (
    <>
      {columnData.headerIconClassName && (
        <th className={columnData.headerIconClassName}></th>
      )}
      <th
        aria-label={columnData.columnName}
        className={columnData.headerClassName}
        colSpan={
          columnData.sortFieldInfo === SORT_FIELDS.DOCKET_NUMBER ? 2 : undefined // Takes into account the consolidated case icon
        }
        // TODO: probably should use aria-sort, but USWDS has default styles for this we may not want
      >
        <SortableColumn
          ascText={SORT_ASCENDING_TEXT[columnData.sortFieldInfo.sortType]}
          currentlySortedField={tableSort.sortField}
          currentlySortedOrder={tableSort.sortOrder}
          data-testid={`${messageListId}-${columnData.sortFieldInfo.sortField}-header-button`}
          defaultSortOrder={
            columnData.sortFieldInfo === SORT_FIELDS.DOCKET_NUMBER
              ? DESCENDING
              : ASCENDING
          }
          descText={SORT_DESCENDING_TEXT[columnData.sortFieldInfo.sortType]}
          hasRows={formattedMessages.hasMessages}
          sortField={columnData.sortFieldInfo.sortField}
          title={columnData.columnName}
          onClickSequence={onSort}
        />
      </th>
    </>
  );
};

const MessageRow = ({
  columns,
  message,
  messageListId,
  onSelect,
  selectable,
}: {
  message: any;
  messageListId: string;
  selectable: boolean;
  onSelect: (messages: any) => void;
  columns: MessageColumnData[];
}) => {
  return (
    <tr>
      {selectable && (
        <td>
          <input
            aria-label={`${message.caseTitle}-${message.subject}-checkbox`}
            checked={message.isSelected}
            id={`${message.caseTitle}-message-checkbox`}
            type="checkbox"
            onChange={() => {
              onSelect({
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
      {columns.map(columnData => {
        return getOneCell({
          columnData,
          message,
          messageListId,
        });
      })}
    </tr>
  );
};

const getOneCell = ({
  columnData,
  message,
  messageListId,
}: {
  messageListId: string;
  message: any;
  columnData: MessageColumnData;
}) => {
  // If the cell requires special handling (e.g., an icon, formatting, etc.), do that
  if (columnData.sortFieldInfo === SORT_FIELDS.DOCKET_NUMBER) {
    return getMessageDocketNumberCell({ message, messageListId });
  }
  if (columnData.sortFieldInfo === SORT_FIELDS.SUBJECT) {
    return getMessageSubjectCell({ columnData, message, messageListId });
  }
  // Otherwise, return a generic cell
  return (
    <td
      className={`message-queue-row ${columnData.sortFieldInfo === SORT_FIELDS.CREATED_AT && 'no-wrap'}`}
      data-testid={`${messageListId}-${columnData.sortFieldInfo.sortField}-cell`}
    >
      {
        message[
          columnData.sortFieldInfo.displayField ||
            columnData.sortFieldInfo.sortField
        ]
      }
    </td>
  );
};

const getMessageDocketNumberCell = ({
  message,
  messageListId,
}: {
  messageListId: string;
  message: any;
}) => {
  return (
    <>
      <td className="consolidated-case-column">
        <ConsolidatedCaseIcon
          consolidatedIconTooltipText={message.consolidatedIconTooltipText}
          inConsolidatedGroup={message.inConsolidatedGroup}
          showLeadCaseIcon={message.isLeadCase}
        />
      </td>
      <td
        className="message-queue-row"
        colSpan={2}
        data-testid={`${messageListId}-docketNumber-cell`}
      >
        {message.docketNumberWithSuffix}
      </td>
    </>
  );
};

const getMessageSubjectCell = ({
  columnData,
  message,
  messageListId,
}: {
  messageListId: string;
  message: any;
  columnData: MessageColumnData;
}) => {
  const hasIconColumn = !!columnData.headerIconClassName;
  const boldText = !message.isRead && hasIconColumn;
  return (
    <>
      {hasIconColumn && (
        <td className="message-unread-column">
          {!message.isRead && (
            <Icon
              aria-label="Unread message"
              className="fa-icon-blue"
              icon="envelope"
              size="1x"
            />
          )}
        </td>
      )}
      <td className="message-queue-row message-subject">
        <div className="message-document-title">
          <Button
            link
            className={classNames('padding-0', boldText ? 'text-bold' : '')}
            data-testid={`${messageListId}-subject-cell`}
            href={message.messageDetailLink}
          >
            {message.subject}
          </Button>
        </div>

        <div className="message-document-detail">{message.message}</div>
      </td>
    </>
  );
};

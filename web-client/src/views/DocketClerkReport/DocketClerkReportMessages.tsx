import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import {
  DocketClerkReportMessageBox,
  DocketClerkReportMessagesResults,
} from '@web-client/presenter/computeds/DocketClerkReport/docketClerkReportMessagesHelper';
import {
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type ColumnConfig = {
  label: string;
  render: (message: any) => React.ReactNode;
  cellIcon?: (message: any) => React.ReactNode;
  headerIconClassName?: string;
  sortField?: string;
  sortType?: 'string' | 'date';
  tdClassName?: string;
};

type FilterConfig = {
  key: string;
  label: string;
  optionsField: keyof DocketClerkReportMessageBox;
};

const subjectCell = (message: any) => (
  <>
    <div className="message-document-title">
      <Button
        link
        className="padding-0"
        data-testid={`message-subject-cell-${message.messageId}`}
        href={message.messageDetailLink}
      >
        {message.subject}
      </Button>
    </div>
    <div className="message-document-detail">{message.message}</div>
  </>
);

const inboxSubjectCell = (message: any) => {
  const boldText = !message.isRead;
  return (
    <>
      <div className="message-document-title">
        <Button
          link
          className={classNames('padding-0', boldText && 'text-bold')}
          data-testid={`message-subject-cell-${message.messageId}`}
          href={message.messageDetailLink}
        >
          {message.subject}
        </Button>
      </div>
      <div className="message-document-detail">{message.message}</div>
    </>
  );
};

const unreadIconCell = (message: any) =>
  !message.isRead && (
    <Icon
      aria-label="Unread message"
      className="fa-icon-blue"
      icon="envelope"
      size="1x"
    />
  );

const docketNumberCell = (message: any) => <CaseLink formattedCase={message} />;

const consolidatedCaseIconCell = (message: any) => (
  <ConsolidatedCaseIcon
    consolidatedIconTooltipText={message.consolidatedIconTooltipText}
    inConsolidatedGroup={message.inConsolidatedGroup}
    showLeadCaseIcon={message.isLeadCase}
  />
);

const COLUMNS: Record<string, ColumnConfig[]> = {
  completed: [
    {
      label: 'Docket No.',
      cellIcon: consolidatedCaseIconCell,
      headerIconClassName: 'consolidated-case-column',
      render: docketNumberCell,
      sortField: 'docketNumber',
      sortType: 'string',
    },
    {
      label: 'Completed',
      render: m => m.completedAtFormatted,
      sortField: 'completedAt',
      sortType: 'date',
    },
    {
      label: 'Last Message',
      render: subjectCell,
      sortField: 'subject',
      sortType: 'string',
      tdClassName: 'message-subject',
    },
    {
      label: 'Case Title',
      render: m => m.caseTitle,
      sortField: 'caseTitle',
      sortType: 'string',
    },
    {
      label: 'Case Status',
      render: m => m.caseStatus,
      sortField: 'caseStatus',
      sortType: 'string',
    },
    {
      label: 'Completed By',
      render: m => m.completedBy,
      sortField: 'completedBy',
      sortType: 'string',
    },
    {
      label: 'Section',
      render: m => m.completedBySection,
      sortField: 'completedBySection',
      sortType: 'string',
    },
  ],
  inbox: [
    {
      label: 'Docket No.',
      cellIcon: consolidatedCaseIconCell,
      headerIconClassName: 'consolidated-case-column',
      render: docketNumberCell,
      sortField: 'docketNumber',
      sortType: 'string',
    },
    {
      label: 'Received',
      render: m => m.createdAtFormatted,
      sortField: 'createdAt',
      sortType: 'date',
    },
    {
      label: 'Message',
      cellIcon: unreadIconCell,
      headerIconClassName: 'message-unread-column',
      render: inboxSubjectCell,
      sortField: 'subject',
      sortType: 'string',
      tdClassName: 'message-subject',
    },
    {
      label: 'Case Title',
      render: m => m.caseTitle,
      sortField: 'caseTitle',
      sortType: 'string',
    },
    {
      label: 'Case Status',
      render: m => m.caseStatus,
      sortField: 'caseStatus',
      sortType: 'string',
    },
    {
      label: 'From',
      render: m => m.from,
      sortField: 'from',
      sortType: 'string',
    },
    {
      label: 'Section',
      render: m => m.fromSectionFormatted,
      sortField: 'fromSectionFormatted',
      sortType: 'string',
    },
  ],
  sent: [
    {
      label: 'Docket No.',
      cellIcon: consolidatedCaseIconCell,
      headerIconClassName: 'consolidated-case-column',
      render: docketNumberCell,
      sortField: 'docketNumber',
      sortType: 'string',
    },
    {
      label: 'Sent',
      render: m => m.createdAtFormatted,
      sortField: 'createdAt',
      sortType: 'date',
    },
    {
      label: 'Message',
      render: subjectCell,
      sortField: 'subject',
      sortType: 'string',
      tdClassName: 'message-subject',
    },
    {
      label: 'Case Title',
      render: m => m.caseTitle,
      sortField: 'caseTitle',
      sortType: 'string',
    },
    {
      label: 'Case Status',
      render: m => m.caseStatus,
      sortField: 'caseStatus',
      sortType: 'string',
    },
    { label: 'To', render: m => m.to, sortField: 'to', sortType: 'string' },
    {
      label: 'Section',
      render: m => m.toSection,
      sortField: 'toSection',
      sortType: 'string',
    },
  ],
};

const FILTERS: Record<string, FilterConfig[]> = {
  completed: [
    { key: 'caseStatus', label: 'Case Status', optionsField: 'caseStatuses' },
    {
      key: 'completedBy',
      label: 'Completed By',
      optionsField: 'completedByUsers',
    },
  ],
  inbox: [
    { key: 'caseStatus', label: 'Case Status', optionsField: 'caseStatuses' },
    { key: 'fromUser', label: 'From', optionsField: 'fromUsers' },
    { key: 'fromSection', label: 'Section', optionsField: 'fromSections' },
  ],
  sent: [
    { key: 'caseStatus', label: 'Case Status', optionsField: 'caseStatuses' },
    { key: 'toUser', label: 'To', optionsField: 'toUsers' },
    { key: 'toSection', label: 'Section', optionsField: 'toSections' },
  ],
};

const messagePanelDeps = {
  batchCompleteMessageSequence: sequences.batchCompleteMessageSequence,
  messagesPage: state.messagesPage,
  screenMetadata: state.screenMetadata,
  setSelectedMessagesSequence: sequences.setSelectedMessagesSequence,
  sortTableSequence: sequences.sortTableSequence,
  tableSort: state.tableSort,
  updateMessageFilterSequence: sequences.updateMessageFilterSequence,
};

type MessagePanelOwnProps = {
  box: DocketClerkReportMessageBox;
  columns: ColumnConfig[];
  filterConfigs: FilterConfig[];
  id: string;
  selectable?: boolean;
};

const MessagePanel = connect<MessagePanelOwnProps, typeof messagePanelDeps>(
  messagePanelDeps,
  function MessagePanel({
    batchCompleteMessageSequence,
    box,
    columns,
    filterConfigs,
    id,
    messagesPage,
    screenMetadata,
    selectable = false,
    setSelectedMessagesSequence,
    sortTableSequence,
    tableSort,
    updateMessageFilterSequence,
  }) {
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
    const allMessagesSelected =
      box.messages.length > 0 && box.messages.every((m: any) => m.isSelected);
    const someMessagesSelected = box.messages.some((m: any) => m.isSelected);

    useEffect(() => {
      if (!selectAllCheckboxRef.current || !selectable) return;
      selectAllCheckboxRef.current.indeterminate =
        someMessagesSelected && !allMessagesSelected;
    }, [someMessagesSelected, allMessagesSelected, selectable]);

    const hasMessages = box.messages.length > 0;

    const filters = filterConfigs.map(filter => ({
      isSelected: screenMetadata[filter.key],
      key: filter.key,
      label: filter.label,
      options: box[filter.optionsField] || [],
    }));

    return (
      <>
        {selectable && screenMetadata.completionSuccess && (
          <div
            aria-live="polite"
            className="usa-alert usa-alert--success"
            data-testid="docket-clerk-report-messages-completion-success"
            role="alert"
          >
            <div className="usa-alert__body">
              <p className="usa-alert__text">
                Message(s) completed at {messagesPage.messagesCompletedAt} by{' '}
                {messagesPage.messagesCompletedBy}
              </p>
            </div>
          </div>
        )}
        <div className="grid-row grid-gap">
          <div
            className={
              selectable
                ? 'desktop:grid-col-8 tablet:grid-col-12 display-flex flex-align-center'
                : undefined
            }
          >
            <TableFilters
              filters={filters}
              onSelect={updateMessageFilterSequence}
            ></TableFilters>
          </div>
          {selectable && (
            <div className="desktop:grid-col-4 tablet:grid-col-12 tablet:margin-top-2 text-right">
              <Button
                link
                className="action-button"
                data-testid={`${id}-batch-complete`}
                disabled={!someMessagesSelected}
                icon="check-circle"
                id={`${id}-button-batch-complete`}
                onClick={() => batchCompleteMessageSequence()}
              >
                Complete
              </Button>
            </div>
          )}
        </div>
        <div className="overflow-x-auto overflow-y-hidden" id={id}>
          <table className="usa-table ustc-table subsection">
            <thead>
              <tr>
                {selectable && (
                  <th>
                    <input
                      aria-label="all-messages-checkbox"
                      checked={allMessagesSelected}
                      data-testid={`${id}-all-messages-checkbox`}
                      disabled={!hasMessages}
                      id={`${id}-all-messages-checkbox`}
                      ref={selectAllCheckboxRef}
                      type="checkbox"
                      onChange={() => {
                        if (allMessagesSelected) {
                          setSelectedMessagesSequence({ messages: [] });
                        } else {
                          setSelectedMessagesSequence({ messages: [] });
                          setSelectedMessagesSequence({
                            messages: box.messages.map((m: any) => ({
                              messageId: m.messageId,
                              parentMessageId: m.parentMessageId,
                            })),
                          });
                        }
                      }}
                    />
                  </th>
                )}
                {columns.map(column => (
                  <React.Fragment key={column.label}>
                    {column.headerIconClassName && (
                      <th className={column.headerIconClassName}></th>
                    )}
                    <th aria-label={column.label}>
                      {column.sortField ? (
                        <SortableColumn
                          ascText={
                            SORT_ASCENDING_TEXT[column.sortType || 'string']
                          }
                          currentlySortedField={tableSort.sortField}
                          currentlySortedOrder={tableSort.sortOrder}
                          data-testid={`${id}-${column.sortField}-header-button`}
                          defaultSortOrder="asc"
                          descText={
                            SORT_DESCENDING_TEXT[column.sortType || 'string']
                          }
                          hasRows={hasMessages}
                          sortField={column.sortField}
                          title={column.label}
                          onClickSequence={sortTableSequence}
                        />
                      ) : (
                        column.label
                      )}
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {box.messages.map(message => (
                <tr key={message.messageId}>
                  {selectable && (
                    <td>
                      <input
                        aria-label={`${message.caseTitle}-${message.subject}-checkbox`}
                        checked={message.isSelected || false}
                        id={`${message.messageId}-message-checkbox`}
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
                  {columns.map(column => (
                    <React.Fragment key={column.label}>
                      {column.cellIcon && (
                        <td className={column.headerIconClassName}>
                          {column.cellIcon(message)}
                        </td>
                      )}
                      <td
                        className={`message-queue-row ${column.tdClassName || ''}`.trim()}
                      >
                        {column.render(message)}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {!hasMessages && <div>There are no messages.</div>}
        </div>
      </>
    );
  },
);

MessagePanel.displayName = 'MessagePanel';

const docketClerkReportMessagesDeps = {
  messages: state.docketClerkReportMessagesHelper,
  setDocketClerkReportMessagesTableSortSequence:
    sequences.setDocketClerkReportMessagesTableSortSequence,
};

export const DocketClerkReportMessages = connect<
  Record<string, never>,
  typeof docketClerkReportMessagesDeps
>(
  docketClerkReportMessagesDeps,
  function DocketClerkReportMessages({
    messages,
    setDocketClerkReportMessagesTableSortSequence,
  }: {
    messages: DocketClerkReportMessagesResults;
    setDocketClerkReportMessagesTableSortSequence: Function;
  }) {
    return (
      <Tabs
        bind="docketClerkReport.box"
        defaultActiveTab="inbox"
        id="messages-tabs"
        onSelect={(box: string) =>
          setDocketClerkReportMessagesTableSortSequence({ box })
        }
      >
        <Tab
          data-testid="docket-clerk-report-messages-inbox-tab"
          tabName="inbox"
          title={`Inbox (${messages.inbox.messages.length})`}
        >
          <MessagePanel
            selectable
            box={messages.inbox}
            columns={COLUMNS.inbox}
            filterConfigs={FILTERS.inbox}
            id="docket-clerk-report-messages-inbox"
          />
        </Tab>
        <Tab
          data-testid="docket-clerk-report-messages-sent-tab"
          tabName="sent"
          title={`Sent`}
        >
          <MessagePanel
            box={messages.sent}
            columns={COLUMNS.sent}
            filterConfigs={FILTERS.sent}
            id="docket-clerk-report-messages-sent"
          />
        </Tab>
        <Tab
          data-testid="docket-clerk-report-messages-completed-tab"
          tabName="completed"
          title={`Completed`}
        >
          <MessagePanel
            box={messages.completed}
            columns={COLUMNS.completed}
            filterConfigs={FILTERS.completed}
            id="docket-clerk-report-messages-completed"
          />
        </Tab>
      </Tabs>
    );
  },
);

DocketClerkReportMessages.displayName = 'DocketClerkReportMessages';

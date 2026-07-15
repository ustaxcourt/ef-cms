import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import {
  DocketClerkReportMessageBox,
  DocketClerkReportMessagesResults,
} from '@web-client/presenter/computeds/DocketClerkReport/docketClerkReportMessagesHelper';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ColumnConfig = {
  label: string;
  render: (message: any) => React.ReactNode;
  sortField?: string;
};

type FilterConfig = {
  key: string;
  label: string;
  optionsField: keyof DocketClerkReportMessageBox;
};

const subjectCell = (message: any) => (
  <a className="case-link" href={message.messageDetailLink}>
    {message.subject}
  </a>
);

const docketNumberCell = (message: any) => <CaseLink formattedCase={message} />;

const COLUMNS: Record<string, ColumnConfig[]> = {
  completed: [
    {
      label: 'Docket No.',
      render: docketNumberCell,
      sortField: 'docketNumber',
    },
    {
      label: 'Completed',
      render: m => m.completedAtFormatted,
      sortField: 'completedAt',
    },
    { label: 'Last Message', render: subjectCell, sortField: 'subject' },
    { label: 'Case Title', render: m => m.caseTitle, sortField: 'caseTitle' },
    {
      label: 'Case Status',
      render: m => m.caseStatus,
      sortField: 'caseStatus',
    },
    {
      label: 'Completed By',
      render: m => m.completedBy,
      sortField: 'completedBy',
    },
    {
      label: 'Section',
      render: m => m.completedBySection,
      sortField: 'completedBySection',
    },
  ],
  inbox: [
    {
      label: 'Docket No.',
      render: docketNumberCell,
      sortField: 'docketNumber',
    },
    {
      label: 'Received',
      render: m => m.createdAtFormatted,
      sortField: 'createdAt',
    },
    { label: 'Message', render: subjectCell, sortField: 'subject' },
    { label: 'Case Title', render: m => m.caseTitle, sortField: 'caseTitle' },
    {
      label: 'Case Status',
      render: m => m.caseStatus,
      sortField: 'caseStatus',
    },
    { label: 'From', render: m => m.from, sortField: 'from' },
    {
      label: 'Section',
      render: m => m.fromSectionFormatted,
      sortField: 'fromSectionFormatted',
    },
  ],
  sent: [
    {
      label: 'Docket No.',
      render: docketNumberCell,
      sortField: 'docketNumber',
    },
    {
      label: 'Sent',
      render: m => m.createdAtFormatted,
      sortField: 'createdAt',
    },
    { label: 'Message', render: subjectCell, sortField: 'subject' },
    { label: 'Case Title', render: m => m.caseTitle, sortField: 'caseTitle' },
    {
      label: 'Case Status',
      render: m => m.caseStatus,
      sortField: 'caseStatus',
    },
    { label: 'To', render: m => m.to, sortField: 'to' },
    { label: 'Section', render: m => m.toSection, sortField: 'toSection' },
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
  screenMetadata: state.screenMetadata,
  sortTableSequence: sequences.sortTableSequence,
  tableSort: state.tableSort,
  updateMessageFilterSequence: sequences.updateMessageFilterSequence,
};

type MessagePanelOwnProps = {
  box: DocketClerkReportMessageBox;
  columns: ColumnConfig[];
  filterConfigs: FilterConfig[];
  id: string;
};

const MessagePanel = connect<MessagePanelOwnProps, typeof messagePanelDeps>(
  messagePanelDeps,
  function MessagePanel({
    box,
    columns,
    filterConfigs,
    id,
    screenMetadata,
    sortTableSequence,
    tableSort,
    updateMessageFilterSequence,
  }) {
    const hasMessages = box.messages.length > 0;

    const filters = filterConfigs.map(filter => ({
      isSelected: screenMetadata[filter.key],
      key: filter.key,
      label: filter.label,
      options: box[filter.optionsField] || [],
    }));

    return (
      <>
        <TableFilters
          filters={filters}
          onSelect={updateMessageFilterSequence}
        ></TableFilters>
        <div className="overflow-x-auto overflow-y-hidden" id={id}>
          <table className="usa-table ustc-table subsection">
            <thead>
              <tr>
                {columns.map(column => (
                  <th aria-label={column.label} key={column.label}>
                    {column.sortField ? (
                      <SortableColumn
                        ascText="In ascending order"
                        currentlySortedField={tableSort.sortField}
                        currentlySortedOrder={tableSort.sortOrder}
                        data-testid={`${id}-${column.sortField}-header-button`}
                        defaultSortOrder="asc"
                        descText="In descending order"
                        hasRows={hasMessages}
                        sortField={column.sortField}
                        title={column.label}
                        onClickSequence={sortTableSequence}
                      />
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {box.messages.map(message => (
                <tr key={message.messageId}>
                  {columns.map(column => (
                    <td className="message-queue-row" key={column.label}>
                      {column.render(message)}
                    </td>
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
};

export const DocketClerkReportMessages = connect<
  Record<string, never>,
  typeof docketClerkReportMessagesDeps
>(
  docketClerkReportMessagesDeps,
  function DocketClerkReportMessages({
    messages,
  }: {
    messages: DocketClerkReportMessagesResults;
  }) {
    return (
      <Tabs
        bind="docketClerkReport.box"
        defaultActiveTab="inbox"
        id="messages-tabs"
      >
        <Tab
          data-testid="docket-clerk-report-messages-inbox-tab"
          tabName="inbox"
          title={`Inbox (${messages.inbox.messages.length})`}
        >
          <MessagePanel
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

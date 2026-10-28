import { MessageTable as ConnectedMessageTable } from './MessageTable';
import { SORTABLE_COLUMNS } from '@web-client/views/Messages/MessageColumns';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@web-client/presenter/shared.cerebral', () => ({
  connect: (_bindings: unknown, component: unknown) => component,
}));

jest.mock('../SuccessNotification', () => ({
  SuccessNotification: () => null,
}));

jest.mock('../ErrorNotification', () => ({
  ErrorNotification: () => null,
}));

type TestMessage = {
  caseStatus: string;
  caseTitle: string;
  consolidatedIconTooltipText?: string;
  createdAtFormatted: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  from: string;
  fromSectionFormatted: string;
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  isRead: boolean;
  message: string;
  messageDetailLink: string;
  messageId: string;
  parentMessageId: string;
  subject: string;
};

type MessageTableTestProps = {
  batchCompleteMessageSequence: () => void;
  formattedMessages: { hasMessages: boolean; messages: TestMessage[] };
  id: string;
  messageColumns: (typeof SORTABLE_COLUMNS)[keyof typeof SORTABLE_COLUMNS][];
  messageFilters: [];
  messagesIndividualInboxHelper: Record<string, unknown>;
  screenMetadata: Record<string, unknown>;
  selectable: boolean;
  setSelectedMessagesSequence: () => void;
  sortTableSequence: () => void;
  tableSort: { sortField: string; sortOrder: string };
  updateMessageFilterSequence: () => void;
};

const MessageTable =
  ConnectedMessageTable as unknown as React.FC<MessageTableTestProps>;

const baseMessage: TestMessage = {
  caseStatus: 'General Docket - Not at Issue',
  caseTitle: 'Bob Smith, Petitioner',
  createdAtFormatted: '05/01/26',
  docketNumber: '101-26',
  docketNumberWithSuffix: '101-26S',
  from: 'Test Petitionsclerk',
  fromSectionFormatted: 'Petitions',
  inConsolidatedGroup: false,
  isLeadCase: false,
  isRead: true,
  message: 'Please review',
  messageDetailLink: '/messages/101-26/message-detail/abc',
  messageId: 'abc',
  parentMessageId: 'parent-abc',
  subject: 'A subject',
};

const renderTable = (
  messages: TestMessage[],
  id: string,
  selectable: boolean = false,
): Document => {
  const markup = renderToStaticMarkup(
    <MessageTable
      batchCompleteMessageSequence={jest.fn()}
      formattedMessages={{ hasMessages: messages.length > 0, messages }}
      id={id}
      messageColumns={[
        SORTABLE_COLUMNS.DOCKET_NUMBER,
        SORTABLE_COLUMNS.RECEIVED,
        SORTABLE_COLUMNS.MESSAGE_WITH_UNREAD_ICON,
        SORTABLE_COLUMNS.CASE_TITLE,
      ]}
      messageFilters={[]}
      messagesIndividualInboxHelper={{
        allMessagesCheckboxEnabled: true,
        allMessagesSelected: false,
        isCompletionButtonEnabled: false,
      }}
      screenMetadata={{}}
      selectable={selectable}
      setSelectedMessagesSequence={jest.fn()}
      sortTableSequence={jest.fn()}
      tableSort={{ sortField: 'createdAt', sortOrder: 'asc' }}
      updateMessageFilterSequence={jest.fn()}
    />,
  );
  return new DOMParser().parseFromString(markup, 'text/html');
};

describe('MessageTable', () => {
  it.each([
    'messages-individual-inbox',
    'messages-individual-outbox',
    'messages-individual-completed',
    'messages-section-inbox',
    'messages-section-outbox',
    'messages-section-completed',
  ])(
    'should render the docket number with suffix as a link to the case detail page in %s',
    (id: string) => {
      const doc = renderTable([baseMessage], id);

      const cell = doc.querySelector(`[data-testid="${id}-docketNumber-cell"]`);
      const link = cell?.querySelector('a');

      expect(link).not.toBeNull();
      expect(link?.getAttribute('href')).toEqual('/case-detail/101-26');
      expect(link?.textContent).toEqual('101-26S');
    },
  );

  it('should render one docket number link per message, each linking to its own case', () => {
    const doc = renderTable(
      [
        baseMessage,
        {
          ...baseMessage,
          docketNumber: '202-26',
          docketNumberWithSuffix: '202-26',
          messageId: 'def',
        },
      ],
      'messages-individual-inbox',
    );

    const links = Array.from(
      doc.querySelectorAll(
        '[data-testid="messages-individual-inbox-docketNumber-cell"] a',
      ),
    );

    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/case-detail/101-26',
      '/case-detail/202-26',
    ]);
    expect(links.map(link => link.textContent)).toEqual(['101-26S', '202-26']);
  });

  it('should not render any docket number links when there are no messages', () => {
    const doc = renderTable([], 'messages-individual-inbox');

    expect(doc.querySelectorAll('a[href^="/case-detail/"]').length).toEqual(0);
    expect(doc.body.textContent).toContain('There are no messages.');
  });

  it('should render the docket number link alongside the row checkbox when messages are selectable', () => {
    const doc = renderTable([baseMessage], 'messages-individual-inbox', true);

    const row = doc
      .querySelector(
        '[data-testid="messages-individual-inbox-docketNumber-cell"]',
      )
      ?.closest('tr');

    expect(row?.querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(
      row?.querySelector('a[href="/case-detail/101-26"]')?.textContent,
    ).toEqual('101-26S');
    expect(
      doc.querySelector('[data-testid="all-messages-checkbox"]'),
    ).not.toBeNull();
    expect(
      doc.querySelector('[data-testid="message-batch-mark-as-complete"]'),
    ).not.toBeNull();
  });
});

import { MOCK_MESSAGE } from '@shared/test/mockMessage';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerkReportMessagesHelper as docketClerkReportMessagesHelperComputed } from './docketClerkReportMessagesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('docketClerkReportMessagesHelper', () => {
  const docketClerkReportMessagesHelper = withAppContextDecorator(
    docketClerkReportMessagesHelperComputed,
    applicationContext,
  );

  const buildMessage = (overrides = {}) => ({
    ...MOCK_MESSAGE,
    ...overrides,
  });

  const emptyState = {
    docketClerkReport: {
      completedMessages: [],
      inboxMessages: [],
      sentMessages: [],
    },
    messagesPage: {
      selectedMessages: new Map<string, string>(),
    },
    screenMetadata: {},
    tableSort: {
      sortField: 'createdAt',
      sortOrder: 'desc',
    },
  };

  it('should return empty message arrays for all boxes when no messages exist', () => {
    const result = runCompute(docketClerkReportMessagesHelper, {
      state: emptyState,
    });

    expect(result.inbox.messages).toEqual([]);
    expect(result.sent.messages).toEqual([]);
    expect(result.completed.messages).toEqual([]);
  });

  it('should include inbox messages in the inbox box', () => {
    const inboxMsg = buildMessage({ messageId: 'inbox-1' });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          inboxMessages: [inboxMsg],
        },
      },
    });

    expect(result.inbox.messages).toHaveLength(1);
    expect(result.sent.messages).toHaveLength(0);
    expect(result.completed.messages).toHaveLength(0);
  });

  it('should include sent messages in the sent box', () => {
    const sentMsg = buildMessage({ messageId: 'sent-1' });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          sentMessages: [sentMsg],
        },
      },
    });

    expect(result.sent.messages).toHaveLength(1);
    expect(result.inbox.messages).toHaveLength(0);
    expect(result.completed.messages).toHaveLength(0);
  });

  it('should include completed messages in the completed box', () => {
    const completedMsg = buildMessage({
      completedAt: '2024-01-20T12:00:00.000Z',
      completedBy: 'Alice Jones',
      isCompleted: true,
      messageId: 'completed-1',
    });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          completedMessages: [completedMsg],
        },
      },
    });

    expect(result.completed.messages).toHaveLength(1);
    expect(result.inbox.messages).toHaveLength(0);
    expect(result.sent.messages).toHaveLength(0);
  });

  it('should return filter value arrays (fromUsers, fromSections, etc.) for each box', () => {
    const inboxMsg = buildMessage({
      messageId: 'filter-test',
      fromSection: 'docket',
    });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          inboxMessages: [inboxMsg],
        },
      },
    });

    expect(result.inbox).toHaveProperty('fromUsers');
    expect(result.inbox).toHaveProperty('fromSections');
    expect(result.inbox).toHaveProperty('caseStatuses');
    expect(result.inbox).toHaveProperty('toSections');
    expect(result.inbox).toHaveProperty('toUsers');
  });

  it('should pass screenMetadata through to the filter pipeline (no active filter returns all messages)', () => {
    const msg1 = buildMessage({ messageId: 'msg-1' });
    const msg2 = buildMessage({ messageId: 'msg-2' });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          inboxMessages: [msg1, msg2],
        },
        // No active filter — all messages should pass through
        screenMetadata: {},
      },
    });

    expect(result.inbox.messages).toHaveLength(2);
  });

  it('should process multiple messages in each box independently', () => {
    const inboxMsg1 = buildMessage({ messageId: 'i1' });
    const inboxMsg2 = buildMessage({ messageId: 'i2' });
    const sentMsg = buildMessage({ messageId: 's1' });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          inboxMessages: [inboxMsg1, inboxMsg2],
          sentMessages: [sentMsg],
        },
      },
    });

    expect(result.inbox.messages).toHaveLength(2);
    expect(result.sent.messages).toHaveLength(1);
    expect(result.completed.messages).toHaveLength(0);
  });

  it('should set isSelected true on messages whose messageId is in selectedMessages', () => {
    const selectedMsg = buildMessage({ messageId: 'inbox-selected' });
    const unselectedMsg = buildMessage({ messageId: 'inbox-unselected' });
    const selectedMessages = new Map<string, string>([
      ['inbox-selected', selectedMsg.parentMessageId],
    ]);

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          inboxMessages: [selectedMsg, unselectedMsg],
        },
        messagesPage: { selectedMessages },
      },
    });

    const selected = result.inbox.messages.find(
      (m: any) => m.messageId === 'inbox-selected',
    );
    const unselected = result.inbox.messages.find(
      (m: any) => m.messageId === 'inbox-unselected',
    );
    expect(selected?.isSelected).toBe(true);
    expect(unselected?.isSelected).toBe(false);
  });

  it('should set isSelected false on all messages when selectedMessages is empty', () => {
    const msg = buildMessage({ messageId: 'inbox-1' });

    const result = runCompute(docketClerkReportMessagesHelper, {
      state: {
        ...emptyState,
        docketClerkReport: {
          ...emptyState.docketClerkReport,
          inboxMessages: [msg],
        },
      },
    });

    expect(result.inbox.messages[0].isSelected).toBe(false);
  });
});

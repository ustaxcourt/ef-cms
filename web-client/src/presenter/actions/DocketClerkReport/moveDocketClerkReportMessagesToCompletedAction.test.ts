import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { moveDocketClerkReportMessagesToCompletedAction } from '@web-client/presenter/actions/DocketClerkReport/moveDocketClerkReportMessagesToCompletedAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('moveDocketClerkReportMessagesToCompletedAction', () => {
  const selectedClerk = {
    name: 'Test Docketclerk',
    section: 'docket',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const buildMessage = (messageId: string) => ({
    createdAt: '2026-07-01T00:00:00.000Z',
    docketNumber: '101-25',
    isCompleted: false,
    isRepliedTo: false,
    messageId,
    parentMessageId: `parent-${messageId}`,
    subject: `subject ${messageId}`,
  });

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  const runWith = ({
    completedMessageIds,
    completedMessages = [],
    inboxMessages,
    clerk = selectedClerk,
  }: {
    completedMessageIds: string[];
    completedMessages?: any[];
    inboxMessages: any[];
    clerk?: any;
  }) =>
    runAction(moveDocketClerkReportMessagesToCompletedAction, {
      modules: { presenter },
      props: { completedMessageIds },
      state: {
        docketClerkReport: {
          completedMessages,
          inboxMessages,
          selectedClerk: clerk,
        },
      },
    });

  it('should remove the completed messages from the inbox and leave the others', async () => {
    const result = await runWith({
      completedMessageIds: ['message-1'],
      inboxMessages: [buildMessage('message-1'), buildMessage('message-2')],
    });

    expect(
      result.state.docketClerkReport.inboxMessages.map(m => m.messageId),
    ).toEqual(['message-2']);
  });

  it('should attribute the completion to the selected clerk rather than the logged-in user', async () => {
    const result = await runWith({
      completedMessageIds: ['message-1'],
      inboxMessages: [buildMessage('message-1')],
    });

    const [completed] = result.state.docketClerkReport.completedMessages;
    expect(completed.completedBy).toBe(selectedClerk.name);
    expect(completed.completedByUserId).toBe(selectedClerk.userId);
    expect(completed.completedBySection).toBe(selectedClerk.section);
  });

  it('should mark the moved messages as completed and replied to', async () => {
    const result = await runWith({
      completedMessageIds: ['message-1'],
      inboxMessages: [buildMessage('message-1')],
    });

    const [completed] = result.state.docketClerkReport.completedMessages;
    expect(completed.isCompleted).toBe(true);
    expect(completed.isRepliedTo).toBe(true);
    expect(completed.completedMessage).toBeNull();
    expect(completed.completedAt).toBeDefined();
  });

  it('should prepend the newly completed messages to the existing completed messages', async () => {
    const existing = {
      ...buildMessage('message-0'),
      completedAt: '2026-06-01T00:00:00.000Z',
      isCompleted: true,
    };

    const result = await runWith({
      completedMessageIds: ['message-1'],
      completedMessages: [existing],
      inboxMessages: [buildMessage('message-1')],
    });

    expect(
      result.state.docketClerkReport.completedMessages.map(m => m.messageId),
    ).toEqual(['message-1', 'message-0']);
  });

  it('should preserve the original message fields on the moved message', async () => {
    const result = await runWith({
      completedMessageIds: ['message-1'],
      inboxMessages: [buildMessage('message-1')],
    });

    const [completed] = result.state.docketClerkReport.completedMessages;
    expect(completed.docketNumber).toBe('101-25');
    expect(completed.subject).toBe('subject message-1');
    expect(completed.parentMessageId).toBe('parent-message-1');
  });

  it('should not change either box when no completed id matches an inbox message', async () => {
    const result = await runWith({
      completedMessageIds: ['not-in-the-inbox'],
      inboxMessages: [buildMessage('message-1')],
    });

    expect(
      result.state.docketClerkReport.inboxMessages.map(m => m.messageId),
    ).toEqual(['message-1']);
    expect(result.state.docketClerkReport.completedMessages).toEqual([]);
  });

  it('should move every message when multiple are completed at once', async () => {
    const result = await runWith({
      completedMessageIds: ['message-1', 'message-2'],
      inboxMessages: [
        buildMessage('message-1'),
        buildMessage('message-2'),
        buildMessage('message-3'),
      ],
    });

    expect(
      result.state.docketClerkReport.inboxMessages.map(m => m.messageId),
    ).toEqual(['message-3']);
    expect(
      result.state.docketClerkReport.completedMessages.map(m => m.messageId),
    ).toEqual(['message-1', 'message-2']);
  });

  it('should leave the completed attribution undefined when no clerk is selected', async () => {
    const result = await runWith({
      clerk: null,
      completedMessageIds: ['message-1'],
      inboxMessages: [buildMessage('message-1')],
    });

    const [completed] = result.state.docketClerkReport.completedMessages;
    expect(completed.completedBy).toBeUndefined();
    expect(completed.completedByUserId).toBeUndefined();
    expect(completed.completedBySection).toBeUndefined();
    expect(completed.isCompleted).toBe(true);
  });
});

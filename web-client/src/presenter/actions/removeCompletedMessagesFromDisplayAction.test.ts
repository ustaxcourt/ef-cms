import { presenter } from '@web-client/presenter/presenter-mock';
import { removeCompletedMessagesFromDisplayAction } from '@web-client/presenter/actions/removeCompletedMessagesFromDisplayAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeCompletedMessagesFromDisplayAction', () => {
  const mockMessage1 = { content: 'Message 1', isRead: true, messageId: '1' };
  const mockMessage2 = { content: 'Message 2', isRead: false, messageId: '2' };
  const mockMessage3 = { content: 'Message 3', isRead: true, messageId: '3' };
  const messagesInInbox = [mockMessage1, mockMessage2, mockMessage3];

  it('should remove completed messages from the inbox display and update counts', async () => {
    const completedMessageIds = [mockMessage1.messageId];

    const result = await runAction(removeCompletedMessagesFromDisplayAction, {
      modules: { presenter },
      props: {
        completedMessageIds,
      },
      state: {
        formattedMessages: {
          messages: messagesInInbox,
        },
        messages: messagesInInbox,
        messagesInboxCount: 0,
        notifications: {
          unreadMessageCount: 0,
        },
      },
    });

    expect(result.state.messages).toEqual([mockMessage2, mockMessage3]);
    expect(result.state.notifications.unreadMessageCount).toEqual(1);
    expect(result.state.messagesInboxCount).toEqual(2);
  });

  it('should not alter the inbox display if no messages are completed and update counts', async () => {
    const completedMessageIds = [];

    const result = await runAction(removeCompletedMessagesFromDisplayAction, {
      modules: { presenter },
      props: {
        completedMessageIds,
      },
      state: {
        formattedMessages: {
          messages: messagesInInbox,
        },
        messages: messagesInInbox,
        messagesInboxCount: 0,
        notifications: {
          unreadMessageCount: 0,
        },
      },
    });

    expect(result.state.messages).toEqual(messagesInInbox);
    expect(result.state.notifications.unreadMessageCount).toEqual(1);
    expect(result.state.messagesInboxCount).toEqual(3);
  });

  it('should remove all messages from the inbox display if all are completed and update counts', async () => {
    const completedMessageIds = [
      mockMessage1.messageId,
      mockMessage2.messageId,
      mockMessage3.messageId,
    ];

    const result = await runAction(removeCompletedMessagesFromDisplayAction, {
      modules: { presenter },
      props: {
        completedMessageIds,
      },
      state: {
        formattedMessages: {
          messages: messagesInInbox,
        },
        messages: messagesInInbox,
        messagesInboxCount: 0,
        notifications: {
          unreadMessageCount: 0,
        },
      },
    });

    expect(result.state.messages).toEqual([]);
    expect(result.state.notifications.unreadMessageCount).toEqual(0);
    expect(result.state.messagesInboxCount).toEqual(0);
  });
});

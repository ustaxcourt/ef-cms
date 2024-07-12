import { presenter } from '@web-client/presenter/presenter-mock';
import { removeCompletedMessagesFromDisplayAction } from '@web-client/presenter/actions/removeCompletedMessagesFromDisplayAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeCompletedMessagesFromDisplayAction', () => {
  const mockMessage1 = { content: 'Message 1', messageId: '1' };
  const mockMessage2 = { content: 'Message 2', messageId: '2' };
  const mockMessage3 = { content: 'Message 3', messageId: '3' };
  const messagesInInbox = [mockMessage1, mockMessage2, mockMessage3];

  it('should remove completed messages from the inbox display', async () => {
    const completedMessageIds = [mockMessage2.messageId];

    const result = await runAction(removeCompletedMessagesFromDisplayAction, {
      modules: { presenter },
      props: {
        completedMessageIds,
      },
      state: {
        formattedMessages: {
          messages: messagesInInbox,
        },
        messages: [],
      },
    });

    expect(result.state.messages).toEqual([mockMessage1, mockMessage3]);
  });

  it('should not alter the inbox display if no messages are completed', async () => {
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
        messages: [],
      },
    });

    expect(result.state.messages).toEqual(messagesInInbox);
  });

  it('should remove all messages from the inbox display if all are completed', async () => {
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
        messages: [],
      },
    });

    expect(result.state.messages).toEqual([]);
  });
});

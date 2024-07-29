import { getMostRecentMessageInThreadAction } from './getMostRecentMessageInThreadAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMostRecentMessageInThreadAction', () => {
  const mockParentMessageId = 'b97d88ed-7ffe-4d62-bf53-8916711b6563';
  const mockMessages = [
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      messageId: 'a8f07169-323d-4801-9a99-d2a8fe8ade91',
      parentMessageId: mockParentMessageId,
    },
    {
      createdAt: '2019-05-01T21:40:46.415Z',
      messageId: 'bce7821c-f1e5-42e4-b459-ee4fb32b6e27',
      parentMessageId: mockParentMessageId,
    },
  ];

  it('returns the most recent message by createdAt from state.messageDetail', async () => {
    const result = await runAction(getMostRecentMessageInThreadAction, {
      state: {
        messageDetail: mockMessages,
      },
    });
    expect(result.output).toEqual({
      mostRecentMessage: mockMessages[1],
      parentMessageId: mockParentMessageId,
    });
  });
});

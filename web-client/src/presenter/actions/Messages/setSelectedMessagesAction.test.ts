import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSelectedMessagesAction } from '@web-client/presenter/actions/Messages/setSelectedMessagesAction';

describe('setSelectedMessagesAction', () => {
  const mockId1 = 'f7b6c1be-1bf7-474e-b20f-2a9fed3011bd';
  const mockParentId1 = '4b955fee-5b26-48ba-a6bb-e5d69b18d3a1';
  const mockId2 = '129ab0f8-fa71-4c1d-99a5-d519cedc4c6b';
  const mockParentId2 = 'e5cc2967-149a-4fe4-b1d0-9401a3bec7f1';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should initialize selectedMessages as a new empty map when props.messages is empty', async () => {
    const { state } = await runAction(setSelectedMessagesAction, {
      modules: { presenter },
      props: {
        messages: [],
      },
      state: {
        messagesIndividualInboxHelper: {
          allMessagesSelected: false,
        },
        messagesPage: {
          selectedMessages: new Map([
            [mockId1, mockParentId1],
            [mockId2, mockParentId2],
          ]),
        },
      },
    });

    expect(state.messagesPage.selectedMessages.size).toEqual(0);
  });

  it('should add new messages to selectedMessages if they do not exist', async () => {
    const { state } = await runAction(setSelectedMessagesAction, {
      modules: { presenter },
      props: {
        messages: [{ messageId: mockId2, parentMessageId: mockParentId2 }],
      },
      state: {
        messagesIndividualInboxHelper: {
          allMessagesSelected: false,
        },
        messagesPage: {
          selectedMessages: new Map([[mockId1, mockParentId1]]),
        },
      },
    });

    expect(state.messagesPage.selectedMessages.size).toEqual(2);
    expect(state.messagesPage.selectedMessages.get(mockId2)).toBe(
      mockParentId2,
    );
  });

  it('should remove messages from selectedMessages if they already exist', async () => {
    const { state } = await runAction(setSelectedMessagesAction, {
      modules: { presenter },
      props: {
        messages: [{ messageId: mockId2, parentMessageId: mockParentId2 }],
      },
      state: {
        messagesIndividualInboxHelper: {
          allMessagesSelected: false,
        },
        messagesPage: {
          selectedMessages: new Map([
            [mockId1, mockParentId1],
            [mockId2, mockParentId2],
          ]),
        },
      },
    });

    expect(state.messagesPage.selectedMessages.size).toEqual(1);
    expect(state.messagesPage.selectedMessages.has(mockId2)).toBeFalsy();
  });

  it('should clear selected messages map if all messages are selected and selectAllBoxChecked is true', async () => {
    const { state } = await runAction(setSelectedMessagesAction, {
      modules: { presenter },
      props: {
        messages: [
          { messageId: mockId1, parentMessageId: mockParentId1 },
          { messageId: mockId2, parentMessageId: mockParentId2 },
        ],
      },
      state: {
        messagesIndividualInboxHelper: {
          allMessagesSelected: true,
        },
        messagesPage: {
          selectedMessages: new Map([
            [mockId1, mockParentId1],
            [mockId2, mockParentId2],
          ]),
        },
      },
    });

    expect(state.messagesPage.selectedMessages.size).toEqual(0);
  });
});

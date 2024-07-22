import { messagesIndividualInboxHelper as inboxHelperComputed } from './messagesIndividualInboxHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('messagesIndividualInboxHelper', () => {
  const mockMessages = [
    {
      messageId: 'b64b9ad9-cbd8-40a9-83f1-1419c3f4b9e2',
    },
    {
      messageId: '0ee15f84-9424-447e-b4ea-a6ada3d5269e',
    },
    {
      messageId: '3b2986af-a37d-49b4-b272-e64834230025',
    },
    {
      messageId: '5a1adc58-2571-4a7f-be32-887fc3be9b67',
    },
  ];

  it('should mark no messages selected when none are selected', () => {
    const result = runCompute(inboxHelperComputed, {
      state: {
        formattedMessages: { messages: mockMessages },
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: 'Today',
          messagesCompletedBy: 'Test User',
          selectedMessages: new Map(),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesCheckboxEnabled: true,
      allMessagesSelected: false,
      completionSuccess: false,
      isCompletionButtonEnabled: false,
      messagesCompletedAt: 'Today',
      messagesCompletedBy: 'Test User',
      someMessagesSelected: false,
    });
  });

  it('should mark some messages selected when more than one but not all are selected', () => {
    const result = runCompute(inboxHelperComputed, {
      state: {
        formattedMessages: { messages: mockMessages },
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: 'Yesterday',
          messagesCompletedBy: 'Test User',
          selectedMessages: new Map([
            ['b64b9ad9-cbd8-40a9-83f1-1419c3f4b9e2', true],
            ['0ee15f84-9424-447e-b4ea-a6ada3d5269e', true],
            ['3b2986af-a37d-49b4-b272-e64834230025', true],
          ]),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesCheckboxEnabled: true,
      allMessagesSelected: false,
      completionSuccess: false,
      isCompletionButtonEnabled: true,
      messagesCompletedAt: 'Yesterday',
      messagesCompletedBy: 'Test User',
      someMessagesSelected: true,
    });
  });

  it('should mark all messages selected when all are selected', () => {
    const result = runCompute(inboxHelperComputed, {
      state: {
        formattedMessages: { messages: mockMessages },
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: 'Yesterday',
          messagesCompletedBy: 'Test User',
          selectedMessages: new Map([
            ['b64b9ad9-cbd8-40a9-83f1-1419c3f4b9e2', true],
            ['0ee15f84-9424-447e-b4ea-a6ada3d5269e', true],
            ['3b2986af-a37d-49b4-b272-e64834230025', true],
            ['5a1adc58-2571-4a7f-be32-887fc3be9b67', true],
          ]),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesCheckboxEnabled: true,
      allMessagesSelected: true,
      completionSuccess: false,
      isCompletionButtonEnabled: true,
      messagesCompletedAt: 'Yesterday',
      messagesCompletedBy: 'Test User',
      someMessagesSelected: true,
    });
  });

  it('should mark only displayed messages as selected', () => {
    const mockFormattedMessages = [mockMessages[0], mockMessages[1]];
    const result = runCompute(inboxHelperComputed, {
      state: {
        formattedMessages: { messages: mockFormattedMessages },
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: 'Yesterday',
          messagesCompletedBy: 'Test User',
          selectedMessages: new Map([
            ['b64b9ad9-cbd8-40a9-83f1-1419c3f4b9e2', true],
            ['0ee15f84-9424-447e-b4ea-a6ada3d5269e', true],
          ]),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesCheckboxEnabled: true,
      allMessagesSelected: true,
      completionSuccess: false,
      isCompletionButtonEnabled: true,
      messagesCompletedAt: 'Yesterday',
      messagesCompletedBy: 'Test User',
      someMessagesSelected: true,
    });
  });
});

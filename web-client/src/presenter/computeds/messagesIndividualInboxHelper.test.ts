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
        messages: mockMessages,
        messagesPage: {
          selectedMessages: new Map(),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesSelected: false,
      isCompletionButtonEnabled: false,
      someMessagesSelected: false,
    });
  });

  it('should mark some messages selected when more than one but not all are selected', () => {
    const result = runCompute(inboxHelperComputed, {
      state: {
        messages: mockMessages,
        messagesPage: {
          selectedMessages: new Map([
            ['1', true],
            ['2', true],
            ['3', true],
          ]),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesSelected: false,
      isCompletionButtonEnabled: true,
      someMessagesSelected: true,
    });
  });

  it('should mark all messages selected when all are selected', () => {
    const result = runCompute(inboxHelperComputed, {
      state: {
        messages: mockMessages,
        messagesPage: {
          selectedMessages: new Map([
            ['1', true],
            ['2', true],
            ['3', true],
            ['4', true],
          ]),
        },
      },
    });

    expect(result).toMatchObject({
      allMessagesSelected: true,
      isCompletionButtonEnabled: true,
      someMessagesSelected: true,
    });
  });
});

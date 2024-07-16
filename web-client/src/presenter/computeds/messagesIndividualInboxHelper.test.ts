import { messagesIndividualInboxHelper as inboxHelperComputed } from './messagesIndividualInboxHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('messagesIndividualInboxHelper', () => {
  it('should mark no messages selected when none are selected', () => {
    const result = runCompute(inboxHelperComputed, {
      state: {
        messagesInboxCount: 5,
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
        messagesInboxCount: 5,
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
        messagesInboxCount: 5,
        messagesPage: {
          selectedMessages: new Map([
            ['1', true],
            ['2', true],
            ['3', true],
            ['4', true],
            ['5', true],
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

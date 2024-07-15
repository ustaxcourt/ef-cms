/* eslint-disable max-lines */

import { DESCENDING } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedMessages as formattedMessagesComputed } from './formattedMessages';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedMessages', () => {
  const { STATUS_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();
  const formattedMessages = withAppContextDecorator(formattedMessagesComputed);

  const mockMessage1 = {
    caseStatus: 'Closed',
    completedAt: '2019-01-02T16:29:13.122Z',
    createdAt: '2019-01-01T16:29:13.122Z',
    docketNumber: '101-20',
    from: 'docket',
    fromSection: 'adc',
    message: 'This is a test message',
    messageId: '1',
    to: 'adc',
    toSection: 'adc',
  };
  const mockMessage2 = {
    caseStatus: 'Open',
    completedAt: '2019-01-01T16:29:13.122Z',
    completedBy: 'Test User',
    createdAt: '2019-01-02T17:29:13.122Z',
    docketNumber: '103-20',
    from: 'petitionsclerk',
    fromSection: 'petitionsclerk',
    isCompleted: true,
    message: 'This is a test message',
    messageId: '2',
    to: 'petitionsclerk',
    toSection: 'petitionsclerk',
  };
  const mockMessage3 = {
    caseStatus: 'New',
    completedAt: '2019-01-03T16:29:13.122Z',
    createdAt: '2019-01-03T17:29:13.122Z',
    docketNumber: '102-20',
    from: 'adc',
    fromSection: 'docket',
    message: 'This is a test message',
    messageId: '3',
    to: 'docket',
    toSection: 'docket',
  };

  it('returns filtered messages sorted oldest to newest and completedMessages from state.messages when messageBoxToDisplay.box is inbox', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'inbox',
        },
        messages: [mockMessage1, mockMessage2, mockMessage3],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      completedMessages: [mockMessage2],
      hasMessages: true,
      messages: [mockMessage1, mockMessage2, mockMessage3],
    });
  });

  it('returns filtered messages sorted newest to oldest when messageBoxToDisplay.box is outbox', () => {
    const result = runCompute(formattedMessages, {
      state: {
        hasMessages: true,
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockMessage1, mockMessage2, mockMessage3],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        tableSort: { sortOrder: DESCENDING },
        user: {
          role: 'docketclerk',
        },
      },
    });

    expect(result).toMatchObject({
      messages: [mockMessage3, mockMessage2, mockMessage1],
    });
  });

  it('returns empty arrays for completedMessages and messages if state.messages is not set', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'inbox',
        },
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      completedMessages: [],
      hasMessages: false,
      messages: [],
    });
  });

  it('the filter dropdown values are set based on the set of unique values found in the messages', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockMessage1, mockMessage2, mockMessage3],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      caseStatuses: expect.arrayContaining(['Closed', 'Open', 'New']),
      fromSections: expect.arrayContaining(['adc', 'petitionsclerk', 'docket']),
      fromUsers: expect.arrayContaining(['docket', 'petitionsclerk', 'adc']),
      toUsers: expect.arrayContaining(['adc', 'petitionsclerk', 'docket']),
    });
  });

  it('the filter dropdown values should be set correctly for the completed messages data', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockMessage1, mockMessage2],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      completedByUsers: expect.arrayContaining(['Test User']),
    });
  });

  it('the messages should be filtered correctly', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockMessage1, mockMessage2],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {
          caseStatus: 'Open',
          fromSection: 'petitionsclerk',
          fromUser: 'petitionsclerk',
          toSection: 'petitionsclerk',
          toUser: 'petitionsclerk',
        },
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.messages.length).toEqual(1);
    expect(result.messages).toEqual(
      expect.arrayContaining([expect.objectContaining(mockMessage2)]),
    );
    expect(result).toMatchObject({
      caseStatuses: expect.arrayContaining(['Open']),
      fromSections: expect.arrayContaining(['petitionsclerk']),
      fromUsers: expect.arrayContaining(['petitionsclerk']),
      toSections: expect.arrayContaining(['petitionsclerk']),
      toUsers: expect.arrayContaining(['petitionsclerk']),
    });
  });

  it('the completed messages should be filtered correctly when we are an ADC user', () => {
    const mockCompletedMessage1 = {
      ...mockMessage1,
      completedAt: '2019-05-01T17:29:13.122Z',
      completedBy: 'ruth',
      isCompleted: true,
    };
    const mockCompletedMessage2 = {
      ...mockMessage2,
      completedAt: '2019-05-01T17:29:13.122Z',
      completedBy: 'bob',
      isCompleted: true,
    };

    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCompletedMessage1, mockCompletedMessage2],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {
          caseStatus: 'Open',
          completedBy: 'bob',
        },
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.completedMessages.length).toEqual(1);
    expect(result.completedMessages).toEqual(
      expect.arrayContaining([expect.objectContaining(mockCompletedMessage2)]),
    );
    expect(result).toMatchObject({
      completedByUsers: expect.arrayContaining(['bob']),
    });
  });

  it('should return the messages unfiltered if no filters are set', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockMessage1, mockMessage2],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockMessage1),
        expect.objectContaining(mockMessage2),
      ]),
    );
    expect(result.messages.length).toEqual(2);
  });

  it('should return the completed messages unfiltered if no filters are set', () => {
    const mockCompletedMessage1 = {
      ...mockMessage1,
      completedAt: '2019-05-01T17:29:13.122Z',
      completedBy: 'ruth',
      isCompleted: true,
    };
    const mockCompletedMessage2 = {
      ...mockMessage2,
      completedAt: '2019-05-01T17:29:13.122Z',
      completedBy: 'bob',
      isCompleted: true,
    };

    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCompletedMessage1, mockCompletedMessage2],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.completedMessages.length).toEqual(2);
  });

  it('should format the case status on the message when caseStatus is Calendared', () => {
    const mockCalendaredMessage = {
      ...mockMessage1,
      caseStatus: STATUS_TYPES.calendared,
      trialDate: '2019-01-01T16:29:13.122Z',
      trialLocation: 'Houston, Texas',
    };

    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.messages[0]).toMatchObject({
      caseStatus: 'Calendared - 01/01/19 Houston, TX',
    });
  });

  it(`should not abbreviate trialLocation when it is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
    const mockCalendaredMessage = {
      ...mockMessage1,
      caseStatus: STATUS_TYPES.calendared,
      trialDate: '2019-01-01T16:29:13.122Z',
      trialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    };

    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
        messagesPage: {
          selectedMessages: new Map(),
        },
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(
      applicationContext.getUtilities().abbreviateState,
    ).not.toHaveBeenCalled();
    expect(result.messages[0]).toMatchObject({
      caseStatus: 'Calendared - 01/01/19 Standalone Remote',
    });
  });
});

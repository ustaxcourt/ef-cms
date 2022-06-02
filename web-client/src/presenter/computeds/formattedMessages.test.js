/* eslint-disable max-lines */
import {
  MOCK_COMPLETED_MESSAGE,
  MOCK_MESSAGE,
} from '../../../../shared/src/test/mockMessages';
import { formattedMessages as formattedMessagesComputed } from './formattedMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedMessages', () => {
  const formattedMessages = withAppContextDecorator(formattedMessagesComputed);

  it('returns filtered messages sorted oldest to newest and completedMessages from state.messages when messageBoxToDisplay.box is inbox', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'inbox',
        },
        messages: [
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-01T16:29:13.122Z',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
        ],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      completedMessages: [
        {
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '103-20',
          isCompleted: true,
          message: 'This is a test message',
        },
      ],
      hasMessages: true,
      messages: [
        {
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-20',
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '103-20',
          isCompleted: true,
          message: 'This is a test message',
        },
      ],
    });
  });

  it('returns filtered messages sorted newest to oldest when messageBoxToDisplay.box is outbox', () => {
    const result = runCompute(formattedMessages, {
      state: {
        hasMessages: true,
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-01T16:29:13.122Z',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
        ],
        screenMetadata: {},
        user: {
          role: 'docketclerk',
        },
      },
    });

    expect(result).toMatchObject({
      messages: [
        {
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '103-20',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-20',
          message: 'This is a test message',
        },
      ],
    });
  });

  it('returns empty arrays for completedMessages and messages if state.messages is not set', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'inbox',
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

  it('the filter dropdown values should be set correctly for the messages data', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            ...MOCK_MESSAGE,
            caseStatus: 'Closed',
            from: 'docket',
            fromSection: 'adc',
            to: 'adc',
            toSection: 'adc',
          },
          {
            ...MOCK_COMPLETED_MESSAGE,
            caseStatus: 'Open',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            to: 'petitionsclerk',
            toSection: 'petitionsclerk',
          },
          {
            ...MOCK_MESSAGE,
            caseStatus: 'New',
            from: 'adc',
            fromSection: 'docket',
            to: 'docket',
            toSection: 'docket',
          },
        ],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      caseStatuses: expect.arrayContaining(['New', 'Open', 'Closed']),
      fromSections: expect.arrayContaining(['docket', 'petitionsclerk', 'adc']),
      fromUsers: expect.arrayContaining(['adc', 'petitionsclerk', 'docket']),
      toUsers: expect.arrayContaining(['docket', 'petitionsclerk', 'adc']),
    });
  });

  it('the filter dropdown values should be set correct for the completed messages data', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            ...MOCK_COMPLETED_MESSAGE,
            completedBy: 'Other',
          },
          {
            ...MOCK_COMPLETED_MESSAGE,
            completedBy: 'Test User',
          },
        ],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      completedByUsers: expect.arrayContaining(['Test User', 'Other']),
    });
  });

  it('the messages should be filtered correctly when we are an ADC user', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            ...MOCK_MESSAGE,
            fromSection: 'docket',
          },
          {
            ...MOCK_MESSAGE,
            caseStatus: 'Open',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            to: 'petitionsclerk',
            toSection: 'petitionsclerk',
          },
        ],
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
      expect.arrayContaining([
        expect.objectContaining({
          caseStatus: 'Open',
          docketNumber: '103-20',
          from: 'petitionsclerk',
          fromSection: 'petitionsclerk',
          message: 'This is a test message',
          to: 'petitionsclerk',
          toSection: 'petitionsclerk',
        }),
      ]),
    );
    expect(result).toMatchObject({
      caseStatuses: expect.arrayContaining(['Open']),
      fromSections: expect.arrayContaining(['petitionsclerk']),
      fromUsers: expect.arrayContaining(['petitionsclerk']),
      showFilters: true,
      toSections: expect.arrayContaining(['petitionsclerk']),
      toUsers: expect.arrayContaining(['petitionsclerk']),
    });
  });

  it('the completed messages should be filtered correctly when we are an ADC user', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            ...MOCK_COMPLETED_MESSAGE,
            completedBy: 'ruth',
          },
          {
            ...MOCK_COMPLETED_MESSAGE,
            completedBy: 'bob',
          },
        ],
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
      expect.arrayContaining([
        expect.objectContaining({
          ...MOCK_COMPLETED_MESSAGE,
          completedBy: 'bob',
        }),
      ]),
    );
    expect(result).toMatchObject({
      completedByUsers: expect.arrayContaining(['bob']),
    });
  });

  it('the return the messages unfiltered if no filters are set', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            ...MOCK_MESSAGE,
            toSection: 'docket',
          },
          {
            ...MOCK_MESSAGE,
            toSection: 'petitionsclerk',
          },
        ],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...MOCK_MESSAGE,
          toSection: 'docket',
        }),
        expect.objectContaining({
          ...MOCK_MESSAGE,
          toSection: 'petitionsclerk',
        }),
      ]),
    );
    expect(result.messages.length).toEqual(2);
  });

  it('the return the completed messaged unfiltered if no filters are set', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            ...MOCK_COMPLETED_MESSAGE,
            completedBy: 'ruth',
          },
          {
            ...MOCK_COMPLETED_MESSAGE,
            completedBy: 'bob',
          },
        ],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.messages.length).toEqual(2);
  });
});

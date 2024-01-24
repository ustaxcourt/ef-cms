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
            createdAt: '2019-01-03T17:29:13.122Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
        ],
        screenMetadata: {},
        tableSort: { sortOrder: DESCENDING },
        user: {
          role: 'docketclerk',
        },
      },
    });

    expect(result).toMatchObject({
      messages: [
        {
          completedAt: '2019-01-03T16:29:13.122Z',
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '103-20',
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-02T16:29:13.122Z',
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

  it('the filter dropdown values are set based on the set of unique values found in the messages', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            caseStatus: 'Closed',
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            from: 'docket',
            fromSection: 'adc',
            message: 'This is a test message',
            to: 'adc',
            toSection: 'adc',
          },
          {
            caseStatus: 'Open',
            completedAt: '2019-01-01T16:29:13.122Z',
            completedBy: 'Test User',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            isCompleted: true,
            message: 'This is a test message',
            to: 'petitionsclerk',
            toSection: 'petitionsclerk',
          },
          {
            caseStatus: 'New',
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '102-20',
            from: 'adc',
            fromSection: 'docket',
            message: 'This is a test message',
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
            caseStatus: 'Closed',
            completedAt: '2019-01-02T16:29:13.122Z',
            completedBy: 'Other',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            from: 'docket',
            fromSection: 'adc',
            isCompleted: true,
            message: 'This is a test message',
            to: 'adc',
            toSection: 'adc',
          },
          {
            caseStatus: 'Open',
            completedAt: '2019-01-01T16:29:13.122Z',
            completedBy: 'Test User',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            isCompleted: true,
            message: 'This is a test message',
            to: 'petitionsclerk',
            toSection: 'petitionsclerk',
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

  it('the messages should be filtered correctly', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [
          {
            caseStatus: 'Closed',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            from: 'docket',
            fromSection: 'adc',
            message: 'This is a test message',
            to: 'adc',
            toSection: 'adc',
          },
          {
            caseStatus: 'Open',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            message: 'This is a test message',
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
            caseStatus: 'Closed',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'ruth',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            from: 'docket',
            fromSection: 'adc',
            isCompleted: true,
            message: 'This is a test message',
            to: 'adc',
            toSection: 'adc',
          },
          {
            caseStatus: 'Open',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'bob',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            isCompleted: true,
            message: 'This is a test message',
            to: 'petitionsclerk',
            toSection: 'petitionsclerk',
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
            caseStatus: 'Closed',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            from: 'docket',
            fromSection: 'adc',
            message: 'This is a test message',
            to: 'adc',
            toSection: 'adc',
          },
          {
            caseStatus: 'Open',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            message: 'This is a test message',
            to: 'petitionsclerk',
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
          caseStatus: 'Closed',
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-20',
          from: 'docket',
          fromSection: 'adc',
          message: 'This is a test message',
          to: 'adc',
          toSection: 'adc',
        }),
        expect.objectContaining({
          caseStatus: 'Open',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '103-20',
          from: 'petitionsclerk',
          fromSection: 'petitionsclerk',
          message: 'This is a test message',
          to: 'petitionsclerk',
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
            caseStatus: 'Closed',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'ruth',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            from: 'docket',
            fromSection: 'adc',
            isCompleted: true,
            message: 'This is a test message',
            to: 'adc',
            toSection: 'adc',
          },
          {
            caseStatus: 'Open',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'bob',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            from: 'petitionsclerk',
            fromSection: 'petitionsclerk',
            isCompleted: true,
            message: 'This is a test message',
            to: 'petitionsclerk',
            toSection: 'petitionsclerk',
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

  it('should format the case status on the message when caseStatus is Calendared', () => {
    const mockCalendaredMessage = {
      caseStatus: STATUS_TYPES.calendared,
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-20',
      message: 'This is a test message',
      trialDate: '2019-01-01T16:29:13.122Z',
      trialLocation: 'Houston, Texas',
    };

    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
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
      caseStatus: STATUS_TYPES.calendared,
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-20',
      message: 'This is a test message',
      trialDate: '2019-01-01T16:29:13.122Z',
      trialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    };

    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
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

/* eslint-disable max-lines */
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  formattedMessages as formattedMessagesComputed,
  getFormattedMessages,
} from './formattedMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedMessages', () => {
  const formattedMessages = withAppContextDecorator(formattedMessagesComputed);
  const { DOCKET_SECTION, PETITIONS_SECTION } =
    applicationContext.getConstants();
  const PARENT_MESSAGE_ID = '078ffe53-23ed-4386-9cc5-d7a175f5c948';

  let validMessage;

  beforeEach(() => {
    validMessage = {
      caseStatus: 'Ready for trial',
      completedAt: '2019-05-01T17:29:13.122Z',
      createdAt: '2019-01-01T17:29:13.122Z',
      docketNumber: '123-45',
      docketNumberSuffix: '',
      from: 'Test Sender',
      fromSection: DOCKET_SECTION,
      fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
      message: 'This is a test message',
      messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
      parentMessageId: PARENT_MESSAGE_ID,
      subject: 'Test subject...',
      to: 'Test Recipient',
      toSection: PETITIONS_SECTION,
      toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
    };
  });

  describe('getFormattedMessages', () => {
    it('returns formatted date strings', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [validMessage],
      });

      expect(result.messages[0].createdAtFormatted).toEqual('01/01/19');
      expect(result.messages[0].completedAtFormatted).toEqual('05/01/19');
    });

    it('returns message detail link', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            from: 'Test Sender',
            fromSection: DOCKET_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
      });

      expect(result.messages[0].messageDetailLink).toEqual(
        `/messages/123-45/message-detail/${PARENT_MESSAGE_ID}`,
      );
    });

    it('sorts messages by createdAt', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
        ],
      });

      expect(result.messages).toMatchObject([
        {
          docketNumber: '101-20',
        },
        {
          docketNumber: '102-20',
        },
        {
          docketNumber: '103-20',
        },
      ]);
    });

    it('returns completedMessages from the given messages', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '102-20',
            isCompleted: true,
            message: 'This is a test message',
          },
        ],
      });

      expect(result.completedMessages).toMatchObject([
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '102-20',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-20',
          isCompleted: true,
          message: 'This is a test message',
        },
      ]);
    });

    it('returns completedMessages in descending order of completedAt', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            // completed third
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-01T16:29:13.122Z',
            // completed first
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '102-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            // completed second
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '103-20',
            isCompleted: true,
            message: 'This is a test message',
          },
        ],
      });

      expect(result.completedMessages).toMatchObject([
        {
          completedAt: '2019-01-03T16:29:13.122Z',
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-20',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-02T16:29:13.122Z',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '103-20',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '102-20',
          isCompleted: true,
          message: 'This is a test message',
        },
      ]);
    });

    it('returns inProgressMessages from the given messages', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message one',
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '101-20',
            isRepliedTo: true,
            message: 'This is a test message two',
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message three',
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '101-20',
            isCompleted: true,
            message: 'This is a test message four',
            parentMessageId: PARENT_MESSAGE_ID,
          },
        ],
      });

      expect(result.inProgressMessages).toEqual([
        {
          completedAtFormatted: undefined,
          createdAt: '2019-01-01T16:29:13.122Z',
          createdAtFormatted: '01/01/19',
          docketNumber: '101-20',
          message: 'This is a test message one',
          messageDetailLink: `/messages/101-20/message-detail/${PARENT_MESSAGE_ID}`,
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          completedAtFormatted: undefined,
          createdAt: '2019-01-01T17:29:13.122Z',
          createdAtFormatted: '01/01/19',
          docketNumber: '101-20',
          message: 'This is a test message three',
          messageDetailLink: `/messages/101-20/message-detail/${PARENT_MESSAGE_ID}`,
          parentMessageId: PARENT_MESSAGE_ID,
        },
      ]);
    });
  });

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
        user: {},
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
        user: {},
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
        screenMetadata: {},
        user: {},
      },
    });

    expect(result).toMatchObject({
      completedMessages: [],
      messages: [],
    });
  });

  it('the filter dropdown values should be set correct for the messages data', () => {
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
        user: {},
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
        user: {},
      },
    });

    expect(result).toMatchObject({
      completedByUsers: expect.arrayContaining(['Test User', 'Other']),
      completedFromSections: expect.arrayContaining(['adc', 'petitionsclerk']),
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
      completedFromSections: expect.arrayContaining(['petitionsclerk']),
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
});

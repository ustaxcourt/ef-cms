/* eslint-disable max-lines */
import { ASCENDING, DESCENDING } from '../presenterConstants';
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

    // EXTRACTED

    // it('sorts messages by createdAt when there is no tableSort configuration', () => {
    //   const result = getFormattedMessages({
    //     applicationContext,
    //     messages: [
    //       {
    //         createdAt: '2019-01-01T16:29:13.122Z',
    //         docketNumber: '101-20',
    //         message: 'This is a test message on 2019-01-01T16:29:13.122Z',
    //       },
    //       {
    //         createdAt: '2019-01-02T17:29:13.122Z',
    //         docketNumber: '103-20',
    //         message: 'This is a test message on 2019-01-02T17:29:13.122Z',
    //       },
    //       {
    //         createdAt: '2019-01-01T17:29:13.122Z',
    //         docketNumber: '102-20',
    //         message: 'This is a test message on 2019-01-01T17:29:13.122Z',
    //       },
    //     ],
    //   });

    //   expect(result.messages).toMatchObject([
    //     {
    //       createdAt: '2019-01-01T16:29:13.122Z',
    //       docketNumber: '101-20',
    //     },
    //     {
    //       createdAt: '2019-01-01T17:29:13.122Z',
    //       docketNumber: '102-20',
    //     },
    //     {
    //       createdAt: '2019-01-02T17:29:13.122Z',
    //       docketNumber: '103-20',
    //     },
    //   ]);
    // });

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

    it('reverses the messages when sortOrder is set to DESCENDING', () => {
      const MESSAGE1 = 'This is a test message one';
      const MESSAGE2 = 'This is a test message two';
      const MESSAGE3 = 'This is a test message three';
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: MESSAGE1,
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '101-20',
            message: MESSAGE2,
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            createdAt: '2019-01-03T17:29:13.122Z',
            docketNumber: '101-20',
            message: MESSAGE3,
            parentMessageId: PARENT_MESSAGE_ID,
          },
        ],
        tableSort: {
          sortField: 'createdAt',
          sortOrder: DESCENDING,
        },
      });

      expect(result.messages[0]).toMatchObject({
        message: MESSAGE3,
      });
      expect(result.messages[1]).toMatchObject({
        message: MESSAGE2,
      });
      expect(result.messages[2]).toMatchObject({
        message: MESSAGE1,
      });
    });
  });

  it('reverses the messages when sortOrder is set to DESCENDING', () => {
    const DOCKET_NUMBER_1 = '101-19';
    const DOCKET_NUMBER_2 = '101-20';
    const DOCKET_NUMBER_3 = '105-20';
    const result = getFormattedMessages({
      applicationContext,
      messages: [
        {
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
          message: 'hello',
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_2,
          message: 'hello',
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
          message: 'hello',
          parentMessageId: PARENT_MESSAGE_ID,
        },
      ],
      tableSort: {
        sortField: 'docketNumber',
        sortOrder: DESCENDING,
      },
    });

    expect(result.messages[0]).toMatchObject({
      docketNumber: DOCKET_NUMBER_3,
    });
    expect(result.messages[1]).toMatchObject({
      docketNumber: DOCKET_NUMBER_2,
    });
    expect(result.messages[2]).toMatchObject({
      docketNumber: DOCKET_NUMBER_1,
    });
  });

  it('reverses the messages when sortOrder is set to DESCENDING', () => {
    const DOCKET_NUMBER_1 = '101-19';
    const DOCKET_NUMBER_2 = '101-20';
    const DOCKET_NUMBER_3 = '105-20';
    const result = getFormattedMessages({
      applicationContext,
      messages: [
        {
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
          message: 'hello',
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_2,
          message: 'hello',
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          createdAt: '2019-01-03T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
          message: 'hello',
          parentMessageId: PARENT_MESSAGE_ID,
        },
      ],
      tableSort: {
        sortField: 'UNKNOWN',
        sortOrder: ASCENDING,
      },
    });

    expect(result.messages[0]).toMatchObject({
      docketNumber: DOCKET_NUMBER_1,
    });
    expect(result.messages[1]).toMatchObject({
      docketNumber: DOCKET_NUMBER_2,
    });
    expect(result.messages[2]).toMatchObject({
      docketNumber: DOCKET_NUMBER_3,
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
      showSortableHeaders: true,
    });
  });

  it('returns filtered messages sorted newest to oldest when messageBoxToDisplay.box is outbox', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
          section: 'section',
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
      showSortableHeaders: false,
    });
  });

  it('returns empty arrays for completedMessages and messages if state.messages is not set', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messageBoxToDisplay: {
          box: 'inbox',
          section: 'section',
        },
        user: {
          role: 'adc',
        },
      },
    });

    expect(result).toMatchObject({
      completedMessages: [],
      messages: [],
    });
  });
});

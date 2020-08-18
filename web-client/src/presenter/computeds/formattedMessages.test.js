import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  formattedMessages as formattedMessagesComputed,
  getFormattedMessages,
} from './formattedMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedMessages = withAppContextDecorator(formattedMessagesComputed);
const { DOCKET_SECTION, PETITIONS_SECTION } = applicationContext.getConstants();

describe('formattedMessages', () => {
  describe('getFormattedMessages', () => {
    it('returns formatted date strings', () => {
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
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
      });

      expect(result.messages[0].createdAtFormatted).toEqual('01/01/19');
      expect(result.messages[0].completedAtFormatted).toEqual('05/01/19');
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
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '103-20',
            isRepliedTo: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
        ],
      });

      expect(result.inProgressMessages).toMatchObject([
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
      state: {},
    });

    expect(result).toMatchObject({
      completedMessages: [],
      messages: [],
    });
  });
});

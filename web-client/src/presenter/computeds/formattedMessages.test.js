import { applicationContext } from '../../applicationContext';
import {
  formattedMessages as formattedMessagesComputed,
  getFormattedMessages,
} from './formattedMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedMessages = withAppContextDecorator(formattedMessagesComputed);

describe('formattedMessages', () => {
  describe('getFormattedMessages', () => {
    it('returns formatted date strings', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            from: 'Test Sender',
            fromSection: 'docket',
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: 'petitions',
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
            caseId: '1',
            createdAt: '2019-01-01T16:29:13.122Z',
            message: 'This is a test message',
          },
          {
            caseId: '3',
            createdAt: '2019-01-02T17:29:13.122Z',
            message: 'This is a test message',
          },
          {
            caseId: '2',
            createdAt: '2019-01-01T17:29:13.122Z',
            message: 'This is a test message',
          },
        ],
      });

      expect(result.messages).toMatchObject([
        {
          caseId: '1',
        },
        {
          caseId: '2',
        },
        {
          caseId: '3',
        },
      ]);
    });

    it('returns completedMessages from the given messages', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            caseId: '1',
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            caseId: '3',
            createdAt: '2019-01-02T17:29:13.122Z',
            message: 'This is a test message',
          },
          {
            caseId: '2',
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            isCompleted: true,
            message: 'This is a test message',
          },
        ],
      });

      expect(result.completedMessages).toMatchObject([
        {
          caseId: '2',
          createdAt: '2019-01-01T17:29:13.122Z',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          caseId: '1',
          createdAt: '2019-01-01T16:29:13.122Z',
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
            caseId: '1',
            completedAt: '2019-01-03T16:29:13.122Z', // completed third
            createdAt: '2019-01-01T16:29:13.122Z',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            caseId: '2',
            completedAt: '2019-01-01T16:29:13.122Z', // completed first
            createdAt: '2019-01-02T17:29:13.122Z',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            caseId: '3',
            completedAt: '2019-01-02T16:29:13.122Z', // completed second
            createdAt: '2019-01-01T17:29:13.122Z',
            isCompleted: true,
            message: 'This is a test message',
          },
        ],
      });

      expect(result.completedMessages).toMatchObject([
        {
          caseId: '1',
          completedAt: '2019-01-03T16:29:13.122Z',
          createdAt: '2019-01-01T16:29:13.122Z',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          caseId: '3',
          completedAt: '2019-01-02T16:29:13.122Z',
          createdAt: '2019-01-01T17:29:13.122Z',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          caseId: '2',
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
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
            caseId: '1',
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            message: 'This is a test message',
          },
          {
            caseId: '3',
            createdAt: '2019-01-02T17:29:13.122Z',
            isRepliedTo: true,
            message: 'This is a test message',
          },
          {
            caseId: '2',
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            message: 'This is a test message',
          },
        ],
      });

      expect(result.inProgressMessages).toMatchObject([
        {
          caseId: '1',
          createdAt: '2019-01-01T16:29:13.122Z',
          message: 'This is a test message',
        },
        {
          caseId: '2',
          createdAt: '2019-01-01T17:29:13.122Z',
          message: 'This is a test message',
        },
      ]);
    });
  });

  it('returns filtered and sorted messages and completedMessages from state.messages', () => {
    const result = runCompute(formattedMessages, {
      state: {
        messages: [
          {
            caseId: '1',
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            message: 'This is a test message',
          },
          {
            caseId: '3',
            completedAt: '2019-01-01T16:29:13.122Z',
            createdAt: '2019-01-02T17:29:13.122Z',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            caseId: '2',
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            message: 'This is a test message',
          },
        ],
      },
    });

    expect(result).toMatchObject({
      completedMessages: [
        {
          caseId: '3',
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          isCompleted: true,
          message: 'This is a test message',
        },
      ],
      messages: [
        {
          caseId: '1',
          createdAt: '2019-01-01T16:29:13.122Z',
          message: 'This is a test message',
        },
        {
          caseId: '2',
          createdAt: '2019-01-01T17:29:13.122Z',
          message: 'This is a test message',
        },
        {
          caseId: '3',
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          isCompleted: true,
          message: 'This is a test message',
        },
      ],
    });
  });
});

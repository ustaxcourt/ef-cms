import { formattedCaseMessages as formattedCaseMessagesComputed } from './formattedCaseMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedCaseMessages = withAppContextDecorator(
  formattedCaseMessagesComputed,
);

describe('formattedCaseMessages', () => {
  it('returns formatted date strings and splits messages into completed and in-progress', () => {
    const result = runCompute(formattedCaseMessages, {
      state: {
        caseDetail: {
          messages: [
            {
              createdAt: '2019-01-01T17:29:13.122Z',
              from: 'Test Sender',
              fromSection: 'docket',
              fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
              isCompleted: false,
              isRepliedTo: false,
              message: 'This is a test message',
              messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
              subject: 'Test subject...',
              to: 'Test Recipient',
              toSection: 'petitions',
              toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
            },
            {
              completedAt: '2019-05-01T17:29:13.122Z',
              createdAt: '2019-01-01T17:29:13.122Z',
              from: 'Test Sender',
              fromSection: 'docket',
              fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
              isCompleted: true,
              isRepliedTo: true,
              message: 'This is a test message',
              messageId: '9df69f8c-2db1-4981-b743-056b70b118c4',
              subject: 'Test subject...',
              to: 'Test Recipient',
              toSection: 'petitions',
              toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      completedMessages: [{ completedAtFormatted: '05/01/19' }],
      inProgressMessages: [{ createdAtFormatted: '01/01/19' }],
    });
  });
});

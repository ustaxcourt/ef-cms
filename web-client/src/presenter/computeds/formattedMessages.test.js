import { formattedMessages as formattedMessagesComputed } from './formattedMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedMessages = withAppContextDecorator(formattedMessagesComputed);

describe('formattedMessages', () => {
  it('returns formatted date strings', () => {
    const result = runCompute(formattedMessages, {
      state: {
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
      },
    });

    expect(result[0].createdAtFormatted).toEqual('01/01/19');
    expect(result[0].completedAtFormatted).toEqual('05/01/19');
  });

  it('sorts messages by createdAt', () => {
    const result = runCompute(formattedMessages, {
      state: {
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
      },
    });

    expect(result).toMatchObject([
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
});

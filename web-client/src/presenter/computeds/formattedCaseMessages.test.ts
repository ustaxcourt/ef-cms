import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedCaseMessages as formattedCaseMessagesComputed } from './formattedCaseMessages';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const formattedCaseMessages = withAppContextDecorator(
  formattedCaseMessagesComputed,
);

const { DOCKET_SECTION, PETITIONS_SECTION } = applicationContext.getConstants();

describe('formattedCaseMessages', () => {
  it('returns formatted date strings and splits messages into completed and in-progress', () => {
    const result = runCompute(formattedCaseMessages, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              documentId: '99981f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentTitle: 'Test Document',
            },
          ],
          messages: [
            {
              attachments: [
                { documentId: '99981f4d-1e47-423a-8caf-6d2fdc3d3859' },
              ],
              createdAt: '2019-01-01T17:29:13.122Z',
              from: 'Test Sender',
              fromSection: DOCKET_SECTION,
              fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
              isCompleted: false,
              isRepliedTo: false,
              message: 'This is a test message',
              messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
              subject: 'Test subject...',
              to: 'Test Recipient',
              toSection: PETITIONS_SECTION,
              toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
            },
            {
              completedAt: '2019-05-01T17:29:13.122Z',
              createdAt: '2019-01-01T17:29:13.122Z',
              from: 'Test Sender',
              fromSection: DOCKET_SECTION,
              fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
              isCompleted: true,
              isRepliedTo: true,
              message: 'This is a test message',
              messageId: '9df69f8c-2db1-4981-b743-056b70b118c4',
              subject: 'Test subject...',
              to: 'Test Recipient',
              toSection: PETITIONS_SECTION,
              toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      completedMessages: [{ completedAtFormatted: '05/01/19' }],
      inProgressMessages: [
        {
          attachments: [
            {
              documentId: '99981f4d-1e47-423a-8caf-6d2fdc3d3859',
            },
          ],
          createdAtFormatted: '01/01/19',
        },
      ],
    });
  });
});

// import { ASCENDING, DESCENDING } from '../presenterConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFormattedMessages } from '../computeds/formattedMessages';
import { sortFormattedMessages } from './sortFormattedMessages';

describe('sortFormattedMessages', () => {
  const { DOCKET_SECTION, PETITIONS_SECTION } =
    applicationContext.getConstants();
  const PARENT_MESSAGE_ID = '078ffe53-23ed-4386-9cc5-d7a175f5c948';
  it('should sort alphabetically if there is there is no sort config', () => {
    const messages = [
      {
        caseStatus: 'Ready for trial 1',
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
      {
        caseStatus: 'Ready for trial 2',
        completedAt: '2019-06-01T17:29:13.122Z',
        createdAt: '2019-02-01T17:29:13.122Z',
        docketNumber: '123-45',
        docketNumberSuffix: '',
        from: 'Test Sender 2',
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
    ];

    const formattedMessages = getFormattedMessages(messages);
    const sortedFormattedMessages = sortFormattedMessages(formattedMessages);

    expect(sortedFormattedMessages).toEqual(
      'Docket 123-19 | Document details | U.S. Tax Court',
    );
  });
});

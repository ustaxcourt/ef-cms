const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  getCompletedMessagesForSectionInteractor,
} = require('./getCompletedMessagesForSectionInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { omit } = require('lodash');

describe('getCompletedMessagesForSectionInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      getCompletedMessagesForSectionInteractor(applicationContext, {}),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('retrieves the messages from persistence and returns them', async () => {
    const messageData = {
      attachments: [],
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Bill Burr',
      completedAt: '2019-05-01T21:40:46.415Z',
      completedBy: 'Test Petitionsclerk',
      completedBySection: PETITIONS_SECTION,
      completedByUserId: '21d7cd77-43e5-4713-92d4-aef69b5f72fd',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      entityName: 'Message',
      from: 'Test Petitionsclerk2',
      fromSection: PETITIONS_SECTION,
      fromUserId: 'fe6eeadd-e4e8-4e56-9ddf-0ebe9516df6b',
      isCompleted: true,
      isRepliedTo: false,
      message: "How's it going?",
      messageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      parentMessageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      pk: 'case|9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      sk: 'message|9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      subject: 'Hey!',
      to: 'Test Petitionsclerk',
      toSection: PETITIONS_SECTION,
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getCompletedSectionInboxMessages.mockReturnValue([messageData]);

    const returnedMessages = await getCompletedMessagesForSectionInteractor(
      applicationContext,
      {
        section: messageData.section,
      },
    );

    expect(
      applicationContext.getPersistenceGateway()
        .getCompletedSectionInboxMessages,
    ).toHaveBeenCalled();
    expect(returnedMessages).toMatchObject([omit(messageData, 'pk', 'sk')]);
  });
});

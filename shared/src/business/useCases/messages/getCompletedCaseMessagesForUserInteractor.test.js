const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getCompletedCaseMessagesForUserInteractor,
} = require('./getCompletedCaseMessagesForUserInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { CASE_STATUS_TYPES, ROLES } = require('../../entities/EntityConstants');
const { omit } = require('lodash');

describe('getCompletedCaseMessagesForUserInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      getCompletedCaseMessagesForUserInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('retrieves the case messages from persistence and returns them', async () => {
    const caseMessageData = {
      attachments: [],
      caseId: '7a130321-0a76-43bc-b3eb-64a18f07987d',
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Bill Burr',
      completedAt: '2019-05-01T21:40:46.415Z',
      completedBy: 'Test Petitionsclerk',
      completedBySection: 'petitions',
      completedByUserId: '21d7cd77-43e5-4713-92d4-aef69b5f72fd',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      entityName: 'CaseMessage',
      from: 'Test Petitionsclerk2',
      fromSection: 'petitions',
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
      toSection: 'petitions',
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getCompletedUserInboxMessages.mockReturnValue([caseMessageData]);

    const returnedMessages = await getCompletedCaseMessagesForUserInteractor({
      applicationContext,
      userId: caseMessageData.completedByUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCompletedUserInboxMessages,
    ).toBeCalled();
    expect(returnedMessages).toMatchObject([omit(caseMessageData, 'pk', 'sk')]);
  });
});

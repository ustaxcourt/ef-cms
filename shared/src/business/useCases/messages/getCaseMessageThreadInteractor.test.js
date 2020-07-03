const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getCaseMessageThreadInteractor,
} = require('./getCaseMessageThreadInteractor');
const { CASE_STATUS_TYPES, ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('getCaseMessageThreadInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      getCaseMessageThreadInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('retrieves the case message thread from persistence and returns it', async () => {
    const mockCaseMessage = {
      attachments: [],
      caseId: '7a130321-0a76-43bc-b3eb-64a18f07987d',
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Bill Burr',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      entityName: 'CaseMessage',
      from: 'Test Petitionsclerk2',
      fromSection: 'petitions',
      fromUserId: 'fe6eeadd-e4e8-4e56-9ddf-0ebe9516df6b',
      isRepliedTo: false,
      message: "How's it going?",
      messageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      parentMessageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
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
      .getCaseMessageThreadByParentId.mockReturnValue([mockCaseMessage]);

    const returnedMessage = await getCaseMessageThreadInteractor({
      applicationContext,
      messageId: mockCaseMessage.messageId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseMessageThreadByParentId,
    ).toBeCalled();
    expect(returnedMessage).toMatchObject([mockCaseMessage]);
  });
});

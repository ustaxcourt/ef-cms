const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { getCaseMessageInteractor } = require('./getCaseMessageInteractor');
const { User } = require('../../entities/User');

describe('getCaseMessageInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      getCaseMessageInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('retrieves the case message from persistence and returns it', async () => {
    const caseMessageData = {
      caseId: '7a130321-0a76-43bc-b3eb-64a18f07987d',
      caseStatus: 'General Docket - Not at Issue',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumberWithSuffix: '123-45S',
      entityName: 'CaseMessage',
      from: 'Test Petitionsclerk2',
      fromSection: 'petitions',
      fromUserId: 'fe6eeadd-e4e8-4e56-9ddf-0ebe9516df6b',
      message: "How's it going?",
      messageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      subject: 'Hey!',
      to: 'Test Petitionsclerk',
      toSection: 'petitions',
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseMessageById.mockReturnValue(caseMessageData);

    const returnedMessage = await getCaseMessageInteractor({
      applicationContext,
      messageId: caseMessageData.messageId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseMessageById,
    ).toBeCalled();
    expect(returnedMessage).toEqual(caseMessageData);
  });
});

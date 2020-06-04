const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createCaseMessageInteractor,
} = require('./createCaseMessageInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { User } = require('../../entities/User');

describe('createCaseMessageInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      createCaseMessageInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates the case message', async () => {
    const caseMessageData = {
      caseId: '7a130321-0a76-43bc-b3eb-64a18f07987d',
      message: "How's it going?",
      subject: 'Hey!',
      toSection: 'petitions',
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        section: 'petitions',
        userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      })
      .mockReturnValueOnce({
        name: 'Test Petitionsclerk2',
        role: User.ROLES.petitionsClerk,
        section: 'petitions',
        userId: 'd90c8a79-9628-4ca9-97c6-02a161a02904',
      });

    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      docketNumber: '123-45',
      docketNumberSuffix: 'S',
      status: 'General Docket - Not at Issue',
    });

    await createCaseMessageInteractor({
      applicationContext,
      ...caseMessageData,
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseMessage,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().createCaseMessage.mock
        .calls[0][0].caseMessage,
    ).toMatchObject({
      ...caseMessageData,
      caseStatus: 'General Docket - Not at Issue',
      docketNumber: '123-45',
      docketNumberSuffix: 'S',
      from: 'Test Petitionsclerk',
      fromSection: 'petitions',
      fromUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      to: 'Test Petitionsclerk2',
    });
  });
});

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
      from: 'Test Petitionsclerk',
      fromSection: 'petitions',
      fromUserId: 'a1638ae0-be78-4185-b751-c19cc5775135',
      message: "How's it going?",
      subject: 'Hey!',
      to: 'Test Petitionsclerk1',
      toSection: 'petitions',
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });

    const caseMessage = await createCaseMessageInteractor({
      applicationContext,
      ...caseMessageData,
    });
    expect(caseMessage).toBeDefined();
  });
});

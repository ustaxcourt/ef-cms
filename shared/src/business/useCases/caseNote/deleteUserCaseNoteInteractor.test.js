const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteUserCaseNoteInteractor,
} = require('./deleteUserCaseNoteInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('deleteUserCaseNoteInteractor', () => {
  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      deleteUserCaseNoteInteractor({
        applicationContext,
        docketNumber: '123-45',
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('deletes a case note', async () => {
    const mockUser = new User({
      name: 'Judge Armen',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext.getPersistenceGateway().deleteUserCaseNote = v => v;
    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => ({
        role: ROLES.judge,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    });

    const caseNote = await deleteUserCaseNoteInteractor({
      applicationContext,
      docketNumber: '123-45',
    });

    expect(caseNote).toBeDefined();
  });
});

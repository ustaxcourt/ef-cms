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

    let error;
    try {
      await deleteUserCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
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

    let error;
    let caseNote;

    try {
      caseNote = await deleteUserCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseNote).toBeDefined();
  });
});

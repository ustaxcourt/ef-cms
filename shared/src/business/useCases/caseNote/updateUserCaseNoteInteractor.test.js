const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateUserCaseNoteInteractor,
} = require('./updateUserCaseNoteInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('updateUserCaseNoteInteractor', () => {
  const mockCaseNote = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    notes: 'hello world',
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  };

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    let error;
    try {
      await updateUserCaseNoteInteractor({
        applicationContext,
        caseId: mockCaseNote.caseId,
        notes: mockCaseNote.notes,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('updates a case note', async () => {
    const mockUser = new User({
      name: 'Judge Armen',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext.getPersistenceGateway().updateUserCaseNote = v =>
      v.caseNoteToUpdate;
    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => ({
        role: ROLES.judge,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    });

    let error;
    let caseNote;

    try {
      caseNote = await updateUserCaseNoteInteractor({
        applicationContext,
        caseId: mockCaseNote.caseId,
        notes: mockCaseNote.notes,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseNote).toBeDefined();
  });
});

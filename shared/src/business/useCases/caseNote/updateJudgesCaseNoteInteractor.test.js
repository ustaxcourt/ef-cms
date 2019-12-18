const {
  updateJudgesCaseNoteInteractor,
} = require('./updateJudgesCaseNoteInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('updateJudgesCaseNoteInteractor', () => {
  let applicationContext;
  const mockCaseNote = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    notes: 'hello world',
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  };

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await updateJudgesCaseNoteInteractor({
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Judge Armen',
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        updateJudgesCaseNote: v => v.caseNoteToUpdate,
      }),
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: () => ({
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      }),
    };

    let error;
    let caseNote;

    try {
      caseNote = await updateJudgesCaseNoteInteractor({
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

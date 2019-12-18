const {
  deleteJudgesCaseNoteInteractor,
} = require('./deleteJudgesCaseNoteInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('deleteJudgesCaseNoteInteractor', () => {
  let applicationContext;

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await deleteJudgesCaseNoteInteractor({
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Judge Armen',
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        deleteJudgesCaseNote: v => v,
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
      caseNote = await deleteJudgesCaseNoteInteractor({
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

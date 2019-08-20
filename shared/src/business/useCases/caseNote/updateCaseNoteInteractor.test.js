const { UnauthorizedError } = require('../../../errors/errors');
const { updateCaseNoteInteractor } = require('./updateCaseNoteInteractor');
const { User } = require('../../entities/User');

describe('updateCaseNoteInteractor', () => {
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
      await updateCaseNoteInteractor({
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
          role: 'judge',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        updateCaseNote: v => v.caseNoteToUpdate,
      }),
    };

    let error;
    let caseNote;

    try {
      caseNote = await updateCaseNoteInteractor({
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

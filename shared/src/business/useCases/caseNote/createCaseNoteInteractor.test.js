const { createCaseNoteInteractor } = require('./createCaseNoteInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('createCaseNoteInteractor', () => {
  let applicationContext;
  const mockCaseNote = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    notes: 'hello world',
    userId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
  };

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await createCaseNoteInteractor({
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

  it('creates a case note', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Judge Armen',
          role: 'judge',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        createCaseNote: v => v.caseNote,
      }),
    };

    let error;
    let caseNote;

    try {
      caseNote = await createCaseNoteInteractor({
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

const { CaseNote } = require('../../entities/cases/CaseNote');
const { validateCaseNoteInteractor } = require('./validateCaseNoteInteractor');

describe('validateCaseNoteInteractor', () => {
  it('returns the expected errors object on an empty case note', () => {
    const errors = validateCaseNoteInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseNote,
        }),
      },
      caseNote: {},
    });

    expect(Object.keys(errors)).toEqual(['caseId', 'notes', 'userId']);
  });
});

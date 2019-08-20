const { Note } = require('../../entities/Note');
const { validateNoteInteractor } = require('./validateNoteInteractor');

describe('validateNoteInteractor', () => {
  it('returns the expected errors object on an empty note', () => {
    const errors = validateNoteInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          Note,
        }),
      },
      note: {},
    });

    expect(Object.keys(errors)).toEqual(['notes']);
  });
});

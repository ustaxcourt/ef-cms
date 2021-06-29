const {
  validateHearingNoteInteractor,
} = require('./validateHearingNoteInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateHearingNoteInteractor', () => {
  it('returns a defined errors object if the note is null', () => {
    const errors = validateHearingNoteInteractor(applicationContext, {
      note: null,
    });

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns null when note is defined', () => {
    const result = validateHearingNoteInteractor(applicationContext, {
      note: 'this is a note',
    });

    expect(result).toEqual(null);
  });
});

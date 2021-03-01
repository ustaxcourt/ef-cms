const {
  validateHearingNoteInteractor,
} = require('./validateHearingNoteInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateHearingNoteInteractor', () => {
  it('returns the expected errors object on an empty docket record', () => {
    const errors = validateHearingNoteInteractor({
      applicationContext,
      note: null,
    });

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns null when there are no errors', () => {
    const result = validateHearingNoteInteractor({
      applicationContext,
      note: 'this is a note',
    });

    expect(result).toEqual(null);
  });
});

const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { validateNoteInteractor } = require('./validateNoteInteractor');

describe('validateNoteInteractor', () => {
  it('returns the expected errors object on an empty note', () => {
    const errors = validateNoteInteractor(applicationContext, {
      note: {},
    });

    expect(Object.keys(errors)).toEqual(['notes']);
  });

  it('returns null on no errors', () => {
    const errors = validateNoteInteractor(applicationContext, {
      note: {
        notes: 'hello world',
      },
    });

    expect(errors).toBeNull();
  });
});

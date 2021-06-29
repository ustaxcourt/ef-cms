const {
  applicationContext,
  over1000Characters,
} = require('../test/createTestApplicationContext');
const {
  validateCalendarNoteInteractor,
} = require('./validateCalendarNoteInteractor');

describe('validateCalendarNoteInteractor', () => {
  it('returns the expected errors object on a note that is over the valid length', () => {
    const errors = validateCalendarNoteInteractor(applicationContext, {
      note: over1000Characters,
    });

    expect(Object.keys(errors)).toEqual(['note']);
  });

  it('returns null on no errors', () => {
    const errors = validateCalendarNoteInteractor(applicationContext, {
      note: 'hello world',
    });

    expect(errors).toBeNull();
  });
});

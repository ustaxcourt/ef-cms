const { HearingNote } = require('./HearingNote');

describe('HearingNote', () => {
  describe('validation', () => {
    it('should have errors if note is undefined', () => {
      const entity = new HearingNote({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        note: HearingNote.VALIDATION_ERROR_MESSAGES.note[1],
      });
    });

    it('should have errors if note is an empty string', () => {
      const entity = new HearingNote({ note: '' });
      expect(entity.getFormattedValidationErrors()).toEqual({
        note: HearingNote.VALIDATION_ERROR_MESSAGES.note[1],
      });
    });

    it('should have errors if note is over 200 characters', () => {
      const entity = new HearingNote({
        note: new Array(201).fill('A').join(''),
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        note: HearingNote.VALIDATION_ERROR_MESSAGES.note[0].message,
      });
    });

    it('should validate if note is correct', () => {
      const entity = new HearingNote({
        note: 'this is a note',
      });
      expect(entity.getFormattedValidationErrors()).toBeNull();
    });
  });
});

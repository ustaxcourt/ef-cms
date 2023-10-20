import { HearingNote } from './HearingNote';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('HearingNote', () => {
  describe('validation', () => {
    it('should have errors if note is undefined', () => {
      const entity = new HearingNote({});
      const customMessages = extractCustomMessages(entity.getValidationRules());

      expect(entity.getFormattedValidationErrors()).toEqual({
        note: customMessages.note[0],
      });
    });

    it('should have errors if note is an empty string', () => {
      const entity = new HearingNote({ note: '' });
      const customMessages = extractCustomMessages(entity.getValidationRules());

      expect(entity.getFormattedValidationErrors()).toEqual({
        note: customMessages.note[0],
      });
    });

    it('should have errors if note is over 200 characters', () => {
      const entity = new HearingNote({
        note: new Array(201).fill('A').join(''),
      });
      const customMessages = extractCustomMessages(entity.getValidationRules());

      expect(entity.getFormattedValidationErrors()).toEqual({
        note: customMessages.note[1],
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

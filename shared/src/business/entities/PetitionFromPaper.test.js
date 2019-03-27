const { PetitionFromPaper } = require('./PetitionFromPaper');

describe('PetitionFromPaper entity', () => {
  describe('validation', () => {
    it('creates a valid petition with minimal information', () => {
      const petition = new PetitionFromPaper({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        petitionFile: { anObject: true },
        receivedAt: new Date().toISOString(),
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
    it('fails validation if date is in the future', () => {
      const petition = new PetitionFromPaper({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        petitionFile: { anObject: true },
        receivedAt: new Date(Date.parse('9999-01-01')).toISOString(),
      });
      expect(petition.getFormattedValidationErrors()).not.toEqual(null);
    });
  });
});

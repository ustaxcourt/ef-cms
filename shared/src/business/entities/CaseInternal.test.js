const { CaseInternal } = require('./CaseInternal');

describe('CaseInternal entity', () => {
  describe('validation', () => {
    it('creates a valid petition with minimal information', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        petitionFile: { anObject: true },
        petitionFileSize: 1,
        receivedAt: new Date().toISOString(),
      });
      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });
    it('fails validation if date is in the future', () => {
      const petition = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        petitionFile: { anObject: true },
        petitionFileSize: 1,
        receivedAt: new Date(Date.parse('9999-01-01')).toISOString(),
      });
      expect(petition.getFormattedValidationErrors()).not.toEqual(null);
    });
    it('fails validation if petitionFile is set, but petitionFileSize is not', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        petitionFile: new File([], 'test.pdf'),
        receivedAt: new Date().toISOString(),
      });

      expect(
        caseInternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual('Your Petition file size is empty.');
    });
    it('fails validation if stinFile is set, but stinFileSize is not', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        receivedAt: new Date().toISOString(),
        stinFile: new File([], 'test.pdf'),
      });

      expect(caseInternal.getFormattedValidationErrors().stinFileSize).toEqual(
        'Your STIN file size is empty.',
      );
    });
  });
});

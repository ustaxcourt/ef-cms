const { CaseInternal } = require('./CaseInternal');

describe('CaseInternal entity', () => {
  describe('validation', () => {
    it('creates a valid petition with minimal information', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        caseType: 'other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        partyType: 'Petitioner',
        petitionFile: { anObject: true },
        petitionFileSize: 1,
        procedureType: 'Small',
        receivedAt: new Date().toISOString(),
      });
      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('fails validation if date is in the future', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        petitionFile: { anObject: true },
        petitionFileSize: 1,
        receivedAt: new Date(Date.parse('9999-01-01')).toISOString(),
      });
      expect(caseInternal.getFormattedValidationErrors()).not.toEqual(null);
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

    it('fails validation if ownershipDisclosureFile is set, but ownershipDisclosureFileSize is not', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        ownershipDisclosureFile: new File([], 'test.pdf'),
        receivedAt: new Date().toISOString(),
      });

      expect(
        caseInternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual('Your Ownership Disclosure Statement file size is empty.');
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but requestForPlaceOfTrialFileSize is not', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        receivedAt: new Date().toISOString(),
        requestForPlaceOfTrialFile: new File([], 'test.pdf'),
      });

      expect(
        caseInternal.getFormattedValidationErrors()
          .requestForPlaceOfTrialFileSize,
      ).toEqual('Your Request for Place of Trial file size is empty.');
    });
  });
});

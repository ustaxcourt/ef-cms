const { CaseInternal } = require('./CaseInternal');
const { ContactFactory } = require('../contacts/ContactFactory');

const { VALIDATION_ERROR_MESSAGES } = CaseInternal;

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
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitionFile: { anObject: true },
        petitionFileSize: 1,
        procedureType: 'Small',
        receivedAt: new Date().toISOString(),
      });
      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('fails validation if date cannot be in the future.', () => {
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
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
    });

    it('fails validation if stinFile is set, but stinFileSize is not', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        receivedAt: new Date().toISOString(),
        stinFile: new File([], 'test.pdf'),
      });

      expect(caseInternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[1],
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
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFileSize[1]);
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
      ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFileSize[1]);
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but preferredTrialCity is not', () => {
      const caseInternal = new CaseInternal({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        receivedAt: new Date().toISOString(),
        requestForPlaceOfTrialFile: new File([], 'test.pdf'),
      });

      expect(
        caseInternal.getFormattedValidationErrors().preferredTrialCity,
      ).toEqual(VALIDATION_ERROR_MESSAGES.preferredTrialCity);
    });
  });
});

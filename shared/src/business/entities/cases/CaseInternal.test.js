const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} = require('../EntityConstants');
const { CaseInternal } = require('./CaseInternal');
const { VALIDATION_ERROR_MESSAGES } = CaseInternal;

describe('CaseInternal entity', () => {
  describe('validation', () => {
    it('returns the expected set of errors for an empty object', () => {
      const caseInternal = new CaseInternal({}, { applicationContext });
      expect(caseInternal.getFormattedValidationErrors()).toEqual({
        caseCaption: VALIDATION_ERROR_MESSAGES.caseCaption,
        caseType: VALIDATION_ERROR_MESSAGES.caseType,
        chooseAtLeastOneValue: VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
        mailingDate: VALIDATION_ERROR_MESSAGES.mailingDate,
        partyType: VALIDATION_ERROR_MESSAGES.partyType,
        petitionFile: VALIDATION_ERROR_MESSAGES.petitionFile,
        petitionPaymentStatus: VALIDATION_ERROR_MESSAGES.petitionPaymentStatus,
        procedureType: VALIDATION_ERROR_MESSAGES.procedureType,
        receivedAt: VALIDATION_ERROR_MESSAGES.receivedAt[1],
      });
    });

    it('creates a valid petition with minimal information', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: 'Other',
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          mailingDate: 'test',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          preferredTrialCity: 'Boise, Idaho',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: { anObject: true },
          requestForPlaceOfTrialFileSize: 1,
          statistics: [
            {
              irsDeficiencyAmount: 1,
              irsTotalPenalties: 1,
              year: '2001',
              yearOrPeriod: 'Year',
            },
          ],
        },
        { applicationContext },
      );
      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an ods file', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: 'Other',
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'Someone',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          mailingDate: 'test',
          orderDesignatingPlaceOfTrial: true,
          ownershipDisclosureFile: { anObject: true },
          ownershipDisclosureFileSize: 1,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );
      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an order for ods instead of an ods file', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: 'Other',
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'Someone',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          mailingDate: 'test',
          orderDesignatingPlaceOfTrial: true,
          orderForOds: true,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );
      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('fails validation if date cannot be in the future.', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          receivedAt: new Date(Date.parse('9999-01-01')).toISOString(),
        },
        { applicationContext },
      );
      expect(caseInternal.getFormattedValidationErrors()).not.toEqual(null);
    });

    it('fails validation if petitionFile is set, but petitionFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: new File([], 'test.pdf'),
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
    });

    it('fails validation if petitionPaymentStatus is Waived but applicationForWaiverOfFilingFeeFile is not set', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()
          .applicationForWaiverOfFilingFeeFile,
      ).toEqual(VALIDATION_ERROR_MESSAGES.applicationForWaiverOfFilingFeeFile);
    });

    it('fails validation if partyType is Corporation and orderForOds is undefined', () => {
      const caseInternal = new CaseInternal(
        {
          partyType: PARTY_TYPES.corporation,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile);
    });

    it('fails validation if partyType is partnershipAsTaxMattersPartner and orderForOds is false', () => {
      const caseInternal = new CaseInternal(
        {
          orderForOds: false,
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile);
    });

    it('fails validation if applicationForWaiverOfFilingFeeFile is set, but applicationForWaiverOfFilingFeeFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          applicationForWaiverOfFilingFeeFile: new File([], 'test.pdf'),
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()
          .applicationForWaiverOfFilingFeeFileSize,
      ).toEqual(
        VALIDATION_ERROR_MESSAGES.applicationForWaiverOfFilingFeeFileSize[1],
      );
    });

    it('fails validation if stinFile is set, but stinFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: new Date().toISOString(),
          stinFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(caseInternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[1],
      );
    });

    it('fails validation if ownershipDisclosureFile is set, but ownershipDisclosureFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          ownershipDisclosureFile: new File([], 'test.pdf'),
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFileSize[1]);
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but requestForPlaceOfTrialFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()
          .requestForPlaceOfTrialFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFileSize[1]);
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but preferredTrialCity is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().preferredTrialCity,
      ).toEqual(VALIDATION_ERROR_MESSAGES.preferredTrialCity);
    });

    it('fails validation if preferredTrialCity is set, but requestForPlaceOfTrialFile is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Guy Fieri, Petitioner',
          preferredTrialCity: 'Flavortown, AR',
          receivedAt: new Date().toISOString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().requestForPlaceOfTrialFile,
      ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile);
    });

    it('fails validation if one of preferredTrialCity, RQT file, or orderDesignatingPlaceOfTrial is not selected', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: 'Other',
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'Someone',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          mailingDate: 'test',
          ownershipDisclosureFile: { anObject: true },
          ownershipDisclosureFileSize: 1,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          stinFile: { anObject: true },
          stinFileSize: 1,
        },
        { applicationContext },
      );
      expect(caseInternal.isValid()).toEqual(false);
      expect(caseInternal.getFormattedValidationErrors()).toEqual({
        chooseAtLeastOneValue: VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
      });
    });

    it('fails validation if only orderDesignatingPlaceOfTrial is present and it is false', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: 'Other',
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'Someone',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          mailingDate: 'test',
          orderDesignatingPlaceOfTrial: false,
          ownershipDisclosureFile: { anObject: true },
          ownershipDisclosureFileSize: 1,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          stinFile: { anObject: true },
          stinFileSize: 1,
        },
        { applicationContext },
      );
      expect(caseInternal.isValid()).toEqual(false);
      expect(caseInternal.getFormattedValidationErrors()).toEqual({
        chooseAtLeastOneValue: VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
      });
    });
  });
});

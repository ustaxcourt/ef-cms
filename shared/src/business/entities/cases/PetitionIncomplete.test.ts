import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  ROLES,
} from '../EntityConstants';
import { Correspondence } from '../Correspondence';
import { PetitionIncomplete } from './PetitionIncomplete';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('petitionIncomplete entity', () => {
  describe('validation', () => {
    it('throws an exception when not provided an application context', () => {
      expect(() => new PetitionIncomplete({}, {} as any)).toThrow();
    });

    it('returns the expected set of errors for an empty object', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {},
        { applicationContext },
      );

      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual({
        caseCaption: PetitionIncomplete.VALIDATION_ERROR_MESSAGES.caseCaption,
        caseType: PetitionIncomplete.VALIDATION_ERROR_MESSAGES.caseType,
        chooseAtLeastOneValue:
          PetitionIncomplete.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
        mailingDate: PetitionIncomplete.VALIDATION_ERROR_MESSAGES.mailingDate,
        partyType: PetitionIncomplete.VALIDATION_ERROR_MESSAGES.partyType,
        petitionFile: PetitionIncomplete.VALIDATION_ERROR_MESSAGES.petitionFile,
        petitionPaymentStatus:
          PetitionIncomplete.VALIDATION_ERROR_MESSAGES.petitionPaymentStatus,
        procedureType:
          PetitionIncomplete.VALIDATION_ERROR_MESSAGES.procedureType,
        receivedAt: PetitionIncomplete.VALIDATION_ERROR_MESSAGES.receivedAt[1],
      });
    });

    it('creates a valid petition with minimal information', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: CASE_TYPES_MAP.other,
          mailingDate: 'test',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          preferredTrialCity: 'Boise, Idaho',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
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

      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual(null);
      expect(petitionIncomplete.isValid()).toEqual(true);
    });

    it('creates a valid petition with archived docket entries', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          archivedDocketEntries: [
            {
              docketNumber: '101-21',
              documentType: 'Petition',
              eventCode: 'A',
              filedBy: 'Test Petitioner',
              filedByRole: ROLES.petitioner,
              userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
            },
          ],
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: CASE_TYPES_MAP.other,
          mailingDate: 'test',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          preferredTrialCity: 'Boise, Idaho',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
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

      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual(null);
      expect(petitionIncomplete.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an cds file', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          archivedDocketEntries: [],
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: { anObject: true },
          corporateDisclosureFileSize: 1,
          mailingDate: 'test',
          orderDesignatingPlaceOfTrial: true,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              inCareOf: 'Someone',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual(null);
      expect(petitionIncomplete.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an order for cds instead of an cds file', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          archivedDocketEntries: [],
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: CASE_TYPES_MAP.other,
          mailingDate: 'test',
          orderDesignatingPlaceOfTrial: true,
          orderForCds: true,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              inCareOf: 'Someone',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual(null);
      expect(petitionIncomplete.isValid()).toEqual(true);
    });

    it('fails validation if date cannot be in the future.', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          receivedAt: '9999-01-01T00:00:00.000Z',
        },
        { applicationContext },
      );
      expect(petitionIncomplete.getFormattedValidationErrors()).not.toEqual(
        null,
      );
    });

    it('fails validation if petitionFile is set, but petitionFileSize is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: new File([], 'test.pdf'),
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES.petitionFileSize[1],
      );
    });

    it('fails validation if petitionPaymentStatus is Waived but applicationForWaiverOfFilingFeeFile is not set', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .applicationForWaiverOfFilingFeeFile,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFile,
      );
    });

    it('fails validation if partyType is Corporation and orderForCds is undefined', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          partyType: PARTY_TYPES.corporation,
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .corporateDisclosureFile,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile,
      );
    });

    it('fails validation if partyType is partnershipAsTaxMattersPartner and orderForCds is false', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          orderForCds: false,
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .corporateDisclosureFile,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile,
      );
    });

    it('fails validation if applicationForWaiverOfFilingFeeFile is set, but applicationForWaiverOfFilingFeeFileSize is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          applicationForWaiverOfFilingFeeFile: new File([], 'test.pdf'),
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .applicationForWaiverOfFilingFeeFileSize,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFileSize[1],
      );
    });

    it('fails validation if stinFile is set, but stinFileSize is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          stinFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!.stinFileSize,
      ).toEqual(PetitionIncomplete.VALIDATION_ERROR_MESSAGES.stinFileSize[1]);
    });

    it('fails validation if corporateDisclosureFile is set, but corporateDisclosureFileSize is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          corporateDisclosureFile: new File([], 'test.pdf'),
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES
          .corporateDisclosureFileSize[1],
      );
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but requestForPlaceOfTrialFileSize is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .requestForPlaceOfTrialFileSize,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES
          .requestForPlaceOfTrialFileSize[1],
      );
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but preferredTrialCity is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!.preferredTrialCity,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES.preferredTrialCity,
      );
    });

    it('fails validation if preferredTrialCity is set, but requestForPlaceOfTrialFile is not', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          caseCaption: 'Dr. Guy Fieri, Petitioner',
          preferredTrialCity: 'Flavortown, AR',
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        petitionIncomplete.getFormattedValidationErrors()!
          .requestForPlaceOfTrialFile,
      ).toEqual(
        PetitionIncomplete.VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile,
      );
    });

    it('fails validation if one of preferredTrialCity, RQT file, or orderDesignatingPlaceOfTrial is not selected', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          archivedDocketEntries: [],
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: { anObject: true },
          corporateDisclosureFileSize: 1,
          mailingDate: 'test',
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              inCareOf: 'Someone',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          stinFile: { anObject: true },
          stinFileSize: 1,
        },
        { applicationContext },
      );

      expect(petitionIncomplete.isValid()).toEqual(false);
      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual({
        chooseAtLeastOneValue:
          PetitionIncomplete.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
      });
    });

    it('fails validation if only orderDesignatingPlaceOfTrial is present and it is false', () => {
      const petitionIncomplete = new PetitionIncomplete(
        {
          archivedDocketEntries: [],
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: { anObject: true },
          corporateDisclosureFileSize: 1,
          mailingDate: 'test',
          orderDesignatingPlaceOfTrial: false,
          partyType: PARTY_TYPES.corporation,
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              inCareOf: 'Someone',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          stinFile: { anObject: true },
          stinFileSize: 1,
        },
        { applicationContext },
      );

      expect(petitionIncomplete.isValid()).toEqual(false);
      expect(petitionIncomplete.getFormattedValidationErrors()).toEqual({
        chooseAtLeastOneValue:
          PetitionIncomplete.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
      });
    });
  });

  it('should populate archivedCorrespondences', () => {
    const mockGuid = applicationContext.getUniqueId();
    const mockCorrespondence = new Correspondence({
      correspondenceId: mockGuid,
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
      userId: mockGuid,
    });

    const petitionIncomplete = new PetitionIncomplete(
      {
        archivedCorrespondences: [mockCorrespondence],
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        caseType: CASE_TYPES_MAP.other,
        mailingDate: 'test',
        partyType: PARTY_TYPES.petitioner,
        petitionFile: { anObject: true },
        petitionFileSize: 1,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
        ],
        preferredTrialCity: 'Boise, Idaho',
        procedureType: 'Small',
        receivedAt: applicationContext.getUtilities().createISODateString(),
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

    expect(petitionIncomplete.getFormattedValidationErrors()).toEqual(null);
    expect(petitionIncomplete.isValid()).toEqual(true);
    expect(petitionIncomplete.archivedCorrespondences.length).toBe(1);
  });
});

import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  ROLES,
} from '../EntityConstants';
import { CaseInternal } from './CaseInternal';
import { Correspondence } from '../Correspondence';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('caseInternal entity', () => {
  describe('validation', () => {
    it('throws an exception when not provided an application context', () => {
      expect(() => new CaseInternal({}, {} as any)).toThrow();
    });

    it('returns the expected set of errors for an empty object', () => {
      const caseInternal = new CaseInternal({}, { applicationContext });

      expect(caseInternal.getFormattedValidationErrors()).toEqual({
        caseCaption: CaseInternal.VALIDATION_ERROR_MESSAGES.caseCaption,
        caseType: CaseInternal.VALIDATION_ERROR_MESSAGES.caseType,
        chooseAtLeastOneValue:
          CaseInternal.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
        mailingDate: CaseInternal.VALIDATION_ERROR_MESSAGES.mailingDate,
        partyType: CaseInternal.VALIDATION_ERROR_MESSAGES.partyType,
        petitionFile: CaseInternal.VALIDATION_ERROR_MESSAGES.petitionFile,
        petitionPaymentStatus:
          CaseInternal.VALIDATION_ERROR_MESSAGES.petitionPaymentStatus,
        procedureType: CaseInternal.VALIDATION_ERROR_MESSAGES.procedureType,
        receivedAt: CaseInternal.VALIDATION_ERROR_MESSAGES.receivedAt[1],
      });
    });

    it('creates a valid petition with minimal information', () => {
      const caseInternal = new CaseInternal(
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

      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('creates a valid petition with archived docket entries', () => {
      const caseInternal = new CaseInternal(
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

      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an cds file', () => {
      const caseInternal = new CaseInternal(
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

      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an order for cds instead of an cds file', () => {
      const caseInternal = new CaseInternal(
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

      expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseInternal.isValid()).toEqual(true);
    });

    it('fails validation if date cannot be in the future.', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          receivedAt: '9999-01-01T00:00:00.000Z',
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
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
    });

    it('fails validation if petitionPaymentStatus is Waived but applicationForWaiverOfFilingFeeFile is not set', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!
          .applicationForWaiverOfFilingFeeFile,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFile,
      );
    });

    it('fails validation if partyType is Corporation and orderForCds is undefined', () => {
      const caseInternal = new CaseInternal(
        {
          partyType: PARTY_TYPES.corporation,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);
    });

    it('fails validation if partyType is partnershipAsTaxMattersPartner and orderForCds is false', () => {
      const caseInternal = new CaseInternal(
        {
          orderForCds: false,
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);
    });

    it('fails validation if applicationForWaiverOfFilingFeeFile is set, but applicationForWaiverOfFilingFeeFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          applicationForWaiverOfFilingFeeFile: new File([], 'test.pdf'),
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!
          .applicationForWaiverOfFilingFeeFileSize,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFileSize[1],
      );
    });

    it('fails validation if stinFile is set, but stinFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          stinFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(caseInternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES.stinFileSize[1],
      );
    });

    it('fails validation if corporateDisclosureFile is set, but corporateDisclosureFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          corporateDisclosureFile: new File([], 'test.pdf'),
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFileSize[1],
      );
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but requestForPlaceOfTrialFileSize is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!
          .requestForPlaceOfTrialFileSize,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES
          .requestForPlaceOfTrialFileSize[1],
      );
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but preferredTrialCity is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!.preferredTrialCity,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.preferredTrialCity);
    });

    it('fails validation if preferredTrialCity is set, but requestForPlaceOfTrialFile is not', () => {
      const caseInternal = new CaseInternal(
        {
          caseCaption: 'Dr. Guy Fieri, Petitioner',
          preferredTrialCity: 'Flavortown, AR',
          receivedAt: applicationContext.getUtilities().createISODateString(),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()!.requestForPlaceOfTrialFile,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile,
      );
    });

    it('fails validation if one of preferredTrialCity, RQT file, or orderDesignatingPlaceOfTrial is not selected', () => {
      const caseInternal = new CaseInternal(
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

      expect(caseInternal.isValid()).toEqual(false);
      expect(caseInternal.getFormattedValidationErrors()).toEqual({
        chooseAtLeastOneValue:
          CaseInternal.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
      });
    });

    it('fails validation if only orderDesignatingPlaceOfTrial is present and it is false', () => {
      const caseInternal = new CaseInternal(
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

      expect(caseInternal.isValid()).toEqual(false);
      expect(caseInternal.getFormattedValidationErrors()).toEqual({
        chooseAtLeastOneValue:
          CaseInternal.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
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

    const caseInternal = new CaseInternal(
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

    expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
    expect(caseInternal.isValid()).toEqual(true);
    expect(caseInternal.archivedCorrespondences.length).toBe(1);
  });
});

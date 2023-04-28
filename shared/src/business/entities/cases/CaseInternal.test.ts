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
import { PDF } from '../documents/PDF';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseInternal', () => {
  it('should throw an exception when the constructor is provided an application context', () => {
    expect(
      () => new CaseInternal({}, { applicationContext: undefined }),
    ).toThrow();
  });

  describe('validation', () => {
    it('should return errors for all the required fields when an empty object is provided to the constructor', () => {
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

    it('should be valid when all the required information is provided', () => {
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
              role: ROLES.petitioner,
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

    it('should return an error when the received at date is in the future.', () => {
      const caseInternal = new CaseInternal(
        {
          receivedAt: '9999-01-01T00:00:00.000Z',
        },
        { applicationContext },
      );

      expect(caseInternal.getFormattedValidationErrors()).not.toEqual(null);
    });

    it('should return errors when the petition file has been provided but it does not have a size', () => {
      const caseInternal: CaseInternal = new CaseInternal(
        {
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: undefined,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().petitionFile.size,
      ).toEqual(PDF.VALIDATION_ERROR_MESSAGES.size[1]);
    });

    it('should return errors when the petition payment status is `Waived` but application for waiver of filing fee file has not been provided', () => {
      const caseInternal = new CaseInternal(
        {
          applicationForWaiverOfFilingFeeFile: undefined,
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()
          .applicationForWaiverOfFilingFeeFile,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFile,
      );
    });

    it('should return errors when party type is `Corporation` and order for CDS is undefined', () => {
      const caseInternal = new CaseInternal(
        {
          orderForCds: undefined,
          partyType: PARTY_TYPES.corporation,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().corporateDisclosureFile,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);
    });

    it('should return errors when party type is `Partnership As Tax Matters Partner` and Order For Cds is false', () => {
      const caseInternal = new CaseInternal(
        {
          orderForCds: false,
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().corporateDisclosureFile,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);
    });

    it('should return errors when Application For Waiver Of Filing Fee file has been provided but it does not have a size', () => {
      const caseInternal = new CaseInternal(
        {
          applicationForWaiverOfFilingFeeFile: new File([], 'test.pdf'),
          applicationForWaiverOfFilingFeeFileSize: undefined,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors()
          .applicationForWaiverOfFilingFeeFile.size,
      ).toEqual(PDF.VALIDATION_ERROR_MESSAGES.size[1]);
    });

    it('should return errors when a Statement of Taxpayer Identification (STIN) file has been provided but it does not have a size', () => {
      const caseInternal = new CaseInternal(
        {
          stinFile: new File([], 'test.pdf'),
          stinFileSize: undefined,
        },
        { applicationContext },
      );

      expect(caseInternal.getFormattedValidationErrors().stinFile.size).toEqual(
        PDF.VALIDATION_ERROR_MESSAGES.size[1],
      );
    });

    it('should return errors when a Corporate Disclosure file has been provided but it does not have a size', () => {
      const caseInternal = new CaseInternal(
        {
          corporateDisclosureFile: new File([], 'test.pdf'),
          corporateDisclosureFileSize: undefined,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().corporateDisclosureFile
          .size,
      ).toEqual(PDF.VALIDATION_ERROR_MESSAGES.size[1]);
    });

    it('should return errors when a Request For Place Of Trial file has been provided but it does not have a size', () => {
      const caseInternal = new CaseInternal(
        {
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
          requestForPlaceOfTrialFileSize: undefined,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().requestForPlaceOfTrialFile
          .size,
      ).toEqual(PDF.VALIDATION_ERROR_MESSAGES.size[1]);
    });

    it('should return errors when a Request For Place Of Trial file has been provided but a preferred Trial City has not been selected', () => {
      const caseInternal = new CaseInternal(
        {
          preferredTrialCity: undefined,
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().preferredTrialCity,
      ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.preferredTrialCity);
    });

    it('should return errors when a preferred trial city has been selected but a Request For Place Of Trial file has not been provided', () => {
      const caseInternal = new CaseInternal(
        {
          preferredTrialCity: 'Flavortown, AR',
          requestForPlaceOfTrialFile: undefined,
        },
        { applicationContext },
      );

      expect(
        caseInternal.getFormattedValidationErrors().requestForPlaceOfTrialFile,
      ).toEqual(
        CaseInternal.VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile,
      );
    });

    it('should return errors when one of preferred trial city, RQT file, or order designating place of trial is not selected', () => {
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

    it('should return errors when only orderDesignatingPlaceOfTrial is present and it is false', () => {
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
    const mockCorrespondenceId = '43065758-3930-4e11-9635-3cc21e83165c';
    const mockCorrespondence = new Correspondence({
      correspondenceId: mockCorrespondenceId,
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
      userId: mockCorrespondenceId,
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

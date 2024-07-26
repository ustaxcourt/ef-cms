import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  ROLES,
} from '../EntityConstants';
import { Correspondence } from '../Correspondence';
import { PaperPetition } from './PaperPetition';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';

describe('paperPetition entity', () => {
  describe('validation', () => {
    it('returns the expected set of errors for an empty object', () => {
      const paperPetition = new PaperPetition(
        {},
        { authorizedUser: mockPetitionsClerkUser },
      );
      expect(paperPetition.getFormattedValidationErrors()).toEqual({
        caseCaption: 'Enter a case caption',
        caseType: 'Select a case type',
        mailingDate: 'Enter a mailing date',
        'object.missing':
          'Select trial location and upload/scan RQT or check Order Designating Place of Trial',
        partyType: 'Select a party type',
        petitionFile: 'Upload or scan a Petition',
        petitionPaymentStatus: 'Select a filing fee option',
        procedureType: 'Select a case procedure',
        receivedAt: 'Enter a valid date received',
      });
    });

    it('creates a valid petition with minimal information', () => {
      const paperPetition = new PaperPetition(
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
          receivedAt: createISODateString(),
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
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(paperPetition.getFormattedValidationErrors()).toEqual(null);
      expect(paperPetition.isValid()).toEqual(true);
    });

    it('creates a valid petition with archived docket entries', () => {
      const paperPetition = new PaperPetition(
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
          receivedAt: createISODateString(),
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
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(paperPetition.getFormattedValidationErrors()).toEqual(null);
      expect(paperPetition.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an cds file', () => {
      const paperPetition = new PaperPetition(
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
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(paperPetition.getFormattedValidationErrors()).toEqual(null);
      expect(paperPetition.isValid()).toEqual(true);
    });

    it('creates a valid petition with partyType Corporation and an order for cds instead of an cds file', () => {
      const paperPetition = new PaperPetition(
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
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(paperPetition.getFormattedValidationErrors()).toEqual(null);
      expect(paperPetition.isValid()).toEqual(true);
    });

    it('fails validation if date cannot be in the future.', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: { anObject: true },
          petitionFileSize: 1,
          receivedAt: '9999-01-01T00:00:00.000Z',
        },
        { authorizedUser: mockPetitionsClerkUser },
      );
      expect(paperPetition.getFormattedValidationErrors()).not.toEqual(null);
    });

    it('fails validation if petitionFile is set, but petitionFileSize is not', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionFile: new File([], 'test.pdf'),
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual('Your Petition file size is empty');
    });

    it('fails validation if petitionPaymentStatus is Waived but applicationForWaiverOfFilingFeeFile is not set', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!
          .applicationForWaiverOfFilingFeeFile,
      ).toEqual('Upload or scan an Application for Waiver of Filing Fee (APW)');
    });

    it('fails validation if partyType is Corporation and orderForCds is undefined', () => {
      const paperPetition = new PaperPetition(
        {
          partyType: PARTY_TYPES.corporation,
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual('Upload or scan Corporate Disclosure Statement(CDS)');
    });

    it('fails validation if partyType is partnershipAsTaxMattersPartner and orderForCds is false', () => {
      const paperPetition = new PaperPetition(
        {
          orderForCds: false,
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual('Upload or scan Corporate Disclosure Statement(CDS)');
    });

    it('fails validation if applicationForWaiverOfFilingFeeFile is set, but applicationForWaiverOfFilingFeeFileSize is not', () => {
      const paperPetition = new PaperPetition(
        {
          applicationForWaiverOfFilingFeeFile: new File([], 'test.pdf'),
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!
          .applicationForWaiverOfFilingFeeFileSize,
      ).toEqual('Your Filing Fee Waiver file size is empty');
    });

    it('fails validation if stinFile is set, but stinFileSize is not', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: createISODateString(),
          stinFile: new File([], 'test.pdf'),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!.stinFileSize,
      ).toEqual('Your STIN file size is empty');
    });

    it('fails validation if attachmentToPetitionFile is set, but attachmentToPetitionFileSize is not', () => {
      const paperPetition = new PaperPetition(
        {
          attachmentToPetitionFile: new File([], 'test.pdf'),
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!
          .attachmentToPetitionFileSize,
      ).toEqual('Your ATP file size is empty');
    });

    it('fails validation if corporateDisclosureFile is set, but corporateDisclosureFileSize is not', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          corporateDisclosureFile: new File([], 'test.pdf'),
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual('Your Corporate Disclosure Statement file size is empty');
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but requestForPlaceOfTrialFileSize is not', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: createISODateString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!
          .requestForPlaceOfTrialFileSize,
      ).toEqual('Your Request for Place of Trial file size is empty');
    });

    it('fails validation if requestForPlaceOfTrialFile is set, but preferredTrialCity is not', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Leo Marvin, Petitioner',
          receivedAt: createISODateString(),
          requestForPlaceOfTrialFile: new File([], 'test.pdf'),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!.preferredTrialCity,
      ).toEqual('Select a preferred trial location');
    });

    it('fails validation if preferredTrialCity is set, but requestForPlaceOfTrialFile is not', () => {
      const paperPetition = new PaperPetition(
        {
          caseCaption: 'Dr. Guy Fieri, Petitioner',
          preferredTrialCity: 'Flavortown, AR',
          receivedAt: createISODateString(),
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(
        paperPetition.getFormattedValidationErrors()!
          .requestForPlaceOfTrialFile,
      ).toEqual('Upload or scan a Request for Place of Trial (RQT)');
    });

    it('fails validation if one of preferredTrialCity, RQT file, or orderDesignatingPlaceOfTrial is not selected', () => {
      const paperPetition = new PaperPetition(
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
          receivedAt: createISODateString(),
          stinFile: { anObject: true },
          stinFileSize: 1,
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(paperPetition.isValid()).toEqual(false);
      expect(paperPetition.getFormattedValidationErrors()).toEqual({
        'object.missing':
          'Select trial location and upload/scan RQT or check Order Designating Place of Trial',
      });
    });

    it('fails validation if only orderDesignatingPlaceOfTrial is present and it is false', () => {
      const paperPetition = new PaperPetition(
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
          receivedAt: createISODateString(),
          stinFile: { anObject: true },
          stinFileSize: 1,
        },
        { authorizedUser: mockPetitionsClerkUser },
      );

      expect(paperPetition.isValid()).toEqual(false);
      expect(paperPetition.getFormattedValidationErrors()).toEqual({
        'object.missing':
          'Select trial location and upload/scan RQT or check Order Designating Place of Trial',
      });
    });
  });

  describe('contactSecondary', () => {
    it('should default the secondary contact phone number to "N/A" is it is not provided', () => {
      const paperPetition = new PaperPetition(
        {
          contactPrimary: {},
          contactSecondary: {},
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        { applicationContext },
      );
      expect(paperPetition.petitioners[1].phone).toEqual('N/A');
    });
  });

  it('should populate archivedCorrespondences', () => {
    const mockGuid = getUniqueId();
    const mockCorrespondence = new Correspondence({
      correspondenceId: mockGuid,
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
      userId: mockGuid,
    });

    const paperPetition = new PaperPetition(
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
        receivedAt: createISODateString(),
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
      { authorizedUser: mockPetitionsClerkUser },
    );

    expect(paperPetition.getFormattedValidationErrors()).toEqual(null);
    expect(paperPetition.isValid()).toEqual(true);
    expect(paperPetition.archivedCorrespondences.length).toBe(1);
  });
});

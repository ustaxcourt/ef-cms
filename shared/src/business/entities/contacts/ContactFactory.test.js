const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} = require('../EntityConstants');
const { Case } = require('../cases/Case');
const { CaseExternal } = require('../cases/CaseExternal');
const { CaseInternal } = require('../cases/CaseInternal');
const { ContactFactory } = require('./ContactFactory');
const { MOCK_CASE } = require('../../../test/mockCase');

let caseExternal;

describe('ContactFactory', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13T08:06:07.539Z',
        mailingDate: 'testing',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      caseExternal = new CaseExternal({
        caseType: 'Other',
        contactPrimary: {
          address1: '876 12th Ave',
          address2: 'Suite 123',
          address3: 'Room 13',
          city: 'Nashville',
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          inCareOf: 'USTC',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13T08:06:07.539Z',
        mailingDate: 'testing',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });

  it('can validate Petitioner contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.petitioner,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns true when contactPrimary is defined and everything else is valid', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.estateWithoutExecutor,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns false for isValid if primary contact is missing', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.estate,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('returns false for isValid if serviceIndicator is an invalid value', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimmy Dean',
        phone: '4444444444',
        postalCode: '05198',
        secondaryName: 'Jimmy Dean',
        serviceIndicator: 'WHAT',
        state: 'AK',
        title: 'Some Title',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.estate,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('a valid petition returns true for isValid', () => {
    const caseExternal = new CaseExternal({
      caseType: 'Other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimmy Dean',
        phone: '4444444444',
        postalCode: '05198',
        secondaryName: 'Jimmy Dean',
        state: 'AK',
        title: 'Some Title',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.estate,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Partnership (BBA Regime) contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.partnershipBBA,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Partnership (BBA Regime) contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        secondaryName: 'Jimmy Dean',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.partnershipBBA,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Trust contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.trust,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Trust contact', () => {
    caseExternal = new CaseExternal({
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
        secondaryName: 'Jimmy Dean',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.trust,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Conservator contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.conservator,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Conservator contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        secondaryName: 'Jimmy Dean',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.conservator,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Guardian contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.guardian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Guardian contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',

      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        secondaryName: 'Jimmy Dean',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.guardian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Custodian contact', () => {
    let caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.custodian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Custodian contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'Other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        secondaryName: 'Jimmy Dean',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.custodian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Donor contact', () => {
    let caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.donor,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Donor contact', () => {
    caseExternal = new CaseExternal({
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
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.donor,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Transferee contact', () => {
    let caseExternal = new CaseExternal({
      caseType: 'Other',

      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.transferee,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });
  it('can validate valid Transferee contact', () => {
    caseExternal = new CaseExternal({
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
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13T08:06:07.539Z',
      mailingDate: 'testing',
      partyType: PARTY_TYPES.transferee,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Memphis, Tennessee',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('throws an Error (upon construction) if `partyType` is defined but not found in the available list', () => {
    expect(() => {
      caseExternal = new CaseExternal({
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
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13T08:06:07.539Z',
        mailingDate: 'testing',
        partyType: 'SOME INVALID PARTY TYPE',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
    }).toThrow('Unrecognized party type "SOME INVALID PARTY TYPE"');
  });

  it('does not require phone number for internal cases', () => {
    const caseInternal = new CaseInternal(
      {
        caseCaption: 'Sisqo',
        caseType: 'Other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13T08:06:07.539Z',
        mailingDate: 'testing',
        partyType: PARTY_TYPES.transferee,
        petitionFile: {},
        petitionFileSize: 1,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        receivedAt: '2009-10-13T08:06:07.539Z',
        requestForPlaceOfTrialFile: new File(
          [],
          'requestForPlaceOfTrialFile.pdf',
        ),
        requestForPlaceOfTrialFileSize: 1,
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      },
      { applicationContext },
    );

    expect(caseInternal.getFormattedValidationErrors()).toEqual(null);
  });

  describe('Cases with otherPetitioners', () => {
    const partyTypeKeys = Object.keys(PARTY_TYPES);
    partyTypeKeys.forEach(partyType => {
      it(`can validate valid contacts for a case with otherPetitioners for party type ${partyType}`, () => {
        let caseWithOtherPetitioners = new Case(
          {
            ...MOCK_CASE,
            contactPrimary: {
              ...MOCK_CASE.contactPrimary,
              inCareOf: 'Peter Parker',
              secondaryName: 'Trustee Name',
            },
            contactSecondary: {
              ...MOCK_CASE.contactPrimary,
              inCareOf: 'Peter Parker',
              secondaryName: 'Trustee Name',
            },
            otherPetitioners: [
              {
                additionalName: 'First Other Petitioner',
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
              {
                additionalName: 'First Other Petitioner',
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
            ],
            partyType: PARTY_TYPES[partyType],
          },
          { applicationContext },
        );

        expect(caseWithOtherPetitioners.getFormattedValidationErrors()).toEqual(
          null,
        );
      });
    });
  });

  describe('getErrorToMessageMap', () => {
    it('gets domestic error message map by default', () => {
      const getErrorToMessageMap = ContactFactory.getErrorToMessageMap({});

      expect(getErrorToMessageMap).toEqual(
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES,
      );
    });

    it('gets international error message map', () => {
      const getErrorToMessageMap = ContactFactory.getErrorToMessageMap({
        countryType: COUNTRY_TYPES.INTERNATIONAL,
      });

      expect(getErrorToMessageMap).toEqual(
        ContactFactory.INTERNATIONAL_VALIDATION_ERROR_MESSAGES,
      );
    });
  });

  describe('getValidationObject', () => {
    it('gets domestic validation object by default', () => {
      const validationObject = ContactFactory.getValidationObject({});

      expect(validationObject).toEqual(ContactFactory.domesticValidationObject);
    });

    it('gets international validation object', () => {
      const validationObject = ContactFactory.getValidationObject({
        countryType: COUNTRY_TYPES.INTERNATIONAL,
      });

      expect(validationObject).toEqual(
        ContactFactory.internationalValidationObject,
      );
    });

    it('gets validation object with phone added for isPaper = true', () => {
      const validationObject = ContactFactory.getValidationObject({
        countryType: COUNTRY_TYPES.DOMESTIC,
        isPaper: true,
      });

      expect(validationObject).toMatchObject({
        ...ContactFactory.domesticValidationObject,
        phone: expect.anything(),
      });
    });
  });

  describe('getContactConstructors', () => {
    it('returns an empty object if no partyType is given', () => {
      const contactConstructor = ContactFactory.getContactConstructors({
        partyType: undefined,
      });

      expect(contactConstructor).toEqual({});
    });
  });
});

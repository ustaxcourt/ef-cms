const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../EntityConstants');
const { CaseExternal } = require('../cases/CaseExternal');
const { ContactFactory } = require('./ContactFactory');

describe('ContactFactory', () => {
  const baseCaseExternal = {
    caseType: CASE_TYPES_MAP.other,
    filingType: 'Myself',
    hasIrsNotice: true,
    irsNoticeDate: '2009-10-13T08:06:07.539Z',
    mailingDate: 'testing',
    partyType: PARTY_TYPES.petitioner,
    petitionFile: {},
    petitionFileSize: 1,
    preferredTrialCity: 'Memphis, Tennessee',
    procedureType: 'Small',
    signature: true,
    stinFile: {},
    stinFileSize: 1,
  };

  it('should throw an error if app context is not passed in', () => {
    expect(() => new CaseExternal(baseCaseExternal, {})).toThrow();
  });

  describe('for Corporation Contacts', () => {
    it('should not validate without contact when the case status is new', () => {
      const caseExternal = new CaseExternal(
        {
          ...baseCaseExternal,
          partyType: PARTY_TYPES.corporation,
        },
        { applicationContext },
      );
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('can validate primary contact when the case is not served', () => {
      const caseExternal = new CaseExternal(
        {
          ...baseCaseExternal,
          partyType: PARTY_TYPES.corporation,
          petitioners: [
            {
              address1: '876 12th Ave',
              address2: 'Suite 123',
              address3: 'Room 13',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              inCareOf: 'USTC',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
        },
        { applicationContext },
      );
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });

  it('can validate Petitioner contact when the case is not served', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'USTC',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('passes validation when primary contact is defined and everything else is valid on an unserved case', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estateWithoutExecutor,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'USTC',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('passes validation when primary contact is defined and everything else is valid on a served case', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estateWithoutExecutor,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'USTC',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      { applicationContext },
    );
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('passes validation when in care of is undefined and everything else is valid on a served case', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estateWithoutExecutor,
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
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      { applicationContext },
    );
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns false for isValid if primary contact is missing', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
      },
      { applicationContext },
    );
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('defaults isAddressSealed to false when no value is specified', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
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
        ],
      },
      { applicationContext },
    );

    expect(caseExternal.getContactPrimary().isAddressSealed).toBe(false);
  });

  it('sets the value of isAddressSealed when a value is specified', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            isAddressSealed: true,
            name: 'Jimmy Dean',
            phone: '4444444444',
            postalCode: '05198',
            secondaryName: 'Jimmy Dean',
            serviceIndicator: 'WHAT',
            state: 'AK',
            title: 'Some Title',
          },
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.getContactPrimary().isAddressSealed).toBe(true);
  });

  it('defaults sealedAndUnavailable to false when no value is specified', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
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
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.getContactPrimary().sealedAndUnavailable).toBe(false);
  });

  it('sets the value of sealedAndUnavailable when a value is specified', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Jimmy Dean',
            phone: '4444444444',
            postalCode: '05198',
            sealedAndUnavailable: true,
            secondaryName: 'Jimmy Dean',
            serviceIndicator: 'WHAT',
            state: 'AK',
            title: 'Some Title',
          },
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.getContactPrimary().sealedAndUnavailable).toBe(true);
  });

  it('returns false for isValid if serviceIndicator is an invalid value', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
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
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('a valid case returns true for isValid when status is new', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Jimmy Dean',
            phone: '4444444444',
            postalCode: '05198',
            secondaryName: 'Jimmy Dean',
            state: 'AK',
            title: 'Some Title',
          },
        ],
      },
      { applicationContext },
    );
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('a valid case returns true for isValid when status is not new', () => {
    const caseExternal = new CaseExternal(
      {
        ...baseCaseExternal,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Jimmy Dean',
            phone: '4444444444',
            postalCode: '05198',
            secondaryName: 'Jimmy Dean',
            state: 'AK',
            title: 'Some Title',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      { applicationContext },
    );

    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  [
    PARTY_TYPES.conservator,
    PARTY_TYPES.corporation,
    PARTY_TYPES.custodian,
    PARTY_TYPES.donor,
    PARTY_TYPES.estate,
    PARTY_TYPES.estateWithoutExecutor,
    PARTY_TYPES.guardian,
    PARTY_TYPES.nextFriendForIncompetentPerson,
    PARTY_TYPES.nextFriendForMinor,
    PARTY_TYPES.partnershipAsTaxMattersPartner,
    PARTY_TYPES.partnershipBBA,
    PARTY_TYPES.partnershipOtherThanTaxMatters,
    PARTY_TYPES.petitioner,
    PARTY_TYPES.survivingSpouse,
    PARTY_TYPES.transferee,
    PARTY_TYPES.trust,
  ].forEach(partyType => {
    it(`can validate invalid ${partyType} contact`, () => {
      const caseExternal = new CaseExternal(
        {
          ...baseCaseExternal,
          partyType,
        },
        { applicationContext },
      );
      expect(caseExternal.isValid()).toEqual(false);
    });

    it(`can validate valid ${partyType} contact`, () => {
      const caseExternal = new CaseExternal(
        {
          ...baseCaseExternal,
          partyType,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              secondaryName: 'Jimmy Dean',
              state: 'AK',
            },
          ],
        },
        { applicationContext },
      );
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });

  [PARTY_TYPES.petitionerDeceasedSpouse, PARTY_TYPES.petitionerSpouse].forEach(
    partyType => {
      it(`can validate invalid ${partyType} contact`, () => {
        const caseExternal = new CaseExternal(
          {
            ...baseCaseExternal,
            partyType,
          },
          { applicationContext },
        );
        expect(caseExternal.isValid()).toEqual(false);
      });

      it(`can validate valid ${partyType} contact`, () => {
        const caseExternal = new CaseExternal(
          {
            ...baseCaseExternal,
            partyType,
            petitioners: [
              {
                address1: '876 12th Ave',
                city: 'Nashville',
                contactType: CONTACT_TYPES.primary,
                countryType: COUNTRY_TYPES.DOMESTIC,
                name: 'Jimmy Dean',
                phone: '1234567890',
                postalCode: '05198',
                secondaryName: 'Jimmy Dean',
                state: 'AK',
              },
              {
                address1: '876 12th Ave',
                city: 'Nashville',
                contactType: CONTACT_TYPES.secondary,
                countryType: COUNTRY_TYPES.DOMESTIC,
                inCareOf: 'Bob Dean',
                name: 'Susan Dean',
                phone: '1234567890',
                postalCode: '05198',
                secondaryName: 'Susan Dean',
                state: 'AK',
              },
            ],
          },
          { applicationContext },
        );
        expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
      });
    },
  );

  it('throws an Error (upon construction) if `partyType` is defined but not found in the available list', () => {
    expect(() => {
      new CaseExternal(
        {
          ...baseCaseExternal,
          partyType: 'SOME INVALID PARTY TYPE',
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
        },
        { applicationContext },
      );
    }).toThrow('Unrecognized party type "SOME INVALID PARTY TYPE"');
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
  });

  describe('getContactConstructors', () => {
    it('should return an empty object if no partyType is given and case has not been served', () => {
      const contactConstructor = ContactFactory.getContactConstructors({
        partyType: undefined,
        status: CASE_STATUS_TYPES.new,
      });

      expect(contactConstructor).toEqual({});
    });
  });

  describe('hasEAccess validation', () => {
    let contactConstructor;

    beforeEach(() => {
      contactConstructor = ContactFactory.createContactFactory(
        {
          additionalErrorMappings: {},
          additionalValidation: {},
        },
        { applicationContext },
      )({ partyType: PARTY_TYPES.petitioner });
    });

    it('fails when an email is not provided and the contact has eAccess', () => {
      const contact = new contactConstructor(
        {
          address1: '876 12th Ave',
          city: 'Nashville',
          contactType: CONTACT_TYPES.primary,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          hasEAccess: true,
          inCareOf: 'USTC',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        { applicationContext },
      );

      expect(contact.getFormattedValidationErrors()).toMatchObject({
        email: '"email" is required',
      });
    });

    it('passes when email is not provided and the contact does not have eAccess', () => {
      const contact = new contactConstructor(
        {
          address1: '876 12th Ave',
          city: 'Nashville',
          contactType: CONTACT_TYPES.primary,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          hasEAccess: false,
          inCareOf: 'USTC',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        { applicationContext },
      );

      expect(contact.getFormattedValidationErrors()).toEqual(null);
    });
  });
});

const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const { getContactSecondary } = require('./Case');
const { isPrivateDocument, PublicCase } = require('./PublicCase');
const { MOCK_COMPLEX_CASE } = require('../../../test/mockComplexCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { omit } = require('lodash');

const mockContactId = 'b430f7f9-06f3-4a25-915d-5f51adab2f29';
const mockContactIdSecond = '39a359e9-dde3-409e-b40e-77a4959b6f2c';
describe('PublicCase', () => {
  describe('validation', () => {
    it('should validate when all information is provided and case is not sealed', () => {
      const entity = new PublicCase(
        {
          caseCaption: 'testing',
          createdAt: '2020-01-02T03:30:45.007Z',
          docketEntries: [{}],
          docketNumber: '101-20',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          irsPractitioners: [{ name: 'Bob' }],
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            {
              contactId: mockContactId,
              contactType: CONTACT_TYPES.primary,
            },
          ],
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
        { applicationContext },
      );

      expect(entity.getFormattedValidationErrors()).toBe(null);
    });

    it('should not validate when case is sealed but sensitive information is provided to constructor', () => {
      const entity = new PublicCase(
        {
          caseCaption: 'testing',
          createdAt: '2020-01-02T03:30:45.007Z',
          docketEntries: [{ any: 'thing' }],
          docketNumber: '111-12',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
          receivedAt: '2020-01-05T03:30:45.007Z',
          sealedDate: '2020-01-05T03:30:45.007Z',
        },
        { applicationContext },
      );

      expect(entity.getFormattedValidationErrors()).toMatchObject({
        // docketNumber is permitted
        // docketNumberSuffix is permitted
        // isSealed is permitted
        caseCaption: expect.anything(),
        receivedAt: expect.anything(),
      });
      expect(getContactSecondary(entity)).toBeUndefined();
      expect(entity.petitioners).toBeUndefined();
    });
  });

  it('should only have expected fields', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        createdAt: 'testing',
        docketEntries: [],
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        irsPractitioners: [],
        isPaper: true,
        otherFilers: [],
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactId: mockContactId,
            contactType: CONTACT_TYPES.primary,
          },
          {
            contactId: mockContactIdSecond,
            contactType: CONTACT_TYPES.secondary,
          },
        ],
        privatePractitioners: [],
        receivedAt: 'testing',
      },
      { applicationContext },
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      docketEntries: [],
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketNumberWithSuffix: 'testingtesting',
      entityName: 'PublicCase',
      hasIrsPractitioner: false,
      isPaper: true,
      isSealed: false,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          contactId: mockContactId,
          contactType: CONTACT_TYPES.primary,
          entityName: 'PublicContact',
        },
        {
          contactId: mockContactIdSecond,
          contactType: CONTACT_TYPES.secondary,
          entityName: 'PublicContact',
          name: undefined,
          state: undefined,
        },
      ],
      receivedAt: 'testing',
    });
  });

  it('should only have expected fields if docketEntries is null', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        contactSecondary: undefined,
        createdAt: 'testing',
        docketEntries: null,
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        irsPractitioners: [],
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactId: mockContactId,
            contactType: CONTACT_TYPES.primary,
          },
        ],
        receivedAt: 'testing',
      },
      { applicationContext },
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      docketEntries: [],
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketNumberWithSuffix: 'testingtesting',
      entityName: 'PublicCase',
      hasIrsPractitioner: false,
      isSealed: false,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          contactId: mockContactId,
          contactType: CONTACT_TYPES.primary,
          entityName: 'PublicContact',
        },
      ],
      receivedAt: 'testing',
    });
  });

  it('should filter draft docketEntries out of the docketEntries array', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        createdAt: 'testing',
        docketEntries: [
          {
            docketEntryId: '123',
            documentType: 'Order that case is assigned',
            isMinuteEntry: false,
            isOnDocketRecord: true,
          },
          { docketEntryId: '234', documentType: 'Order', isDraft: true },
          { docketEntryId: '345', documentType: 'Petition' },
          { docketEntryId: '987', eventCode: TRANSCRIPT_EVENT_CODE },
        ],
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        irsPractitioners: [],
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactId: mockContactId,
            contactType: CONTACT_TYPES.primary,
          },
        ],
        receivedAt: 'testing',
      },
      { applicationContext },
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      docketEntries: [
        {
          additionalInfo: undefined,
          additionalInfo2: undefined,
          docketEntryId: '123',
          documentTitle: undefined,
          documentType: 'Order that case is assigned',
          eventCode: undefined,
          filedBy: undefined,
          isMinuteEntry: false,
          isOnDocketRecord: true,
          isPaper: undefined,
          isSealed: false,
          processingStatus: undefined,
          receivedAt: undefined,
          servedAt: undefined,
          servedParties: undefined,
        },
      ],
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketNumberWithSuffix: 'testingtesting',
      entityName: 'PublicCase',
      hasIrsPractitioner: false,
      isSealed: false,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          contactId: mockContactId,
          contactType: CONTACT_TYPES.primary,
          entityName: 'PublicContact',
        },
      ],
      receivedAt: 'testing',
    });
  });

  it('should sort the docketEntries array by received date', () => {
    const docketEntry1 = {
      documentTitle: '1',
      isOnDocketRecord: true,
      receivedAt: '2024-03-01T00:00:00.000Z',
    };

    const docketEntry2 = {
      documentTitle: '2',
      isOnDocketRecord: true,
      receivedAt: '2024-02-01T00:00:00.000Z',
    };

    const docketEntry3 = {
      documentTitle: '3',
      isOnDocketRecord: true,
      receivedAt: '2024-01-01T00:00:00.000Z',
    };

    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: 'testing',
        docketEntries: [docketEntry1, docketEntry2, docketEntry3],
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        irsPractitioners: [],
        partyType: PARTY_TYPES.petitioner,
        petitioners: [{ contactType: CONTACT_TYPES.primary }],
        receivedAt: 'testing',
      },
      { applicationContext },
    );

    expect(entity.docketEntries[0].documentTitle).toEqual(
      docketEntry3.documentTitle,
    );
    expect(entity.docketEntries[1].documentTitle).toEqual(
      docketEntry2.documentTitle,
    );
    expect(entity.docketEntries[2].documentTitle).toEqual(
      docketEntry1.documentTitle,
    );
  });

  describe('isPrivateDocument', () => {
    it('should return true for a stipulated decision document that is not on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Stipulated Decision',
          eventCode: STIPULATED_DECISION_EVENT_CODE,
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a stipulated decision document that is on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Stipulated Decision',
          eventCode: STIPULATED_DECISION_EVENT_CODE,
          isOnDocketRecord: true,
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a transcript document', () => {
      const isPrivate = isPrivateDocument(
        {
          docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
          eventCode: TRANSCRIPT_EVENT_CODE,
        },
        [{ docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801' }],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for an order document that is not on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Order',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a court-issued order document that is not on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Order',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return false for a court-issued order document that is on the docket record', () => {
      const isPrivate = isPrivateDocument({
        docketEntryId: '123',
        documentType: 'Order',
        isOnDocketRecord: true,
      });
      expect(isPrivate).toEqual(false);
    });

    it('should return true for an external document', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Petition',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a court-issued document that is stricken', () => {
      const isPrivate = isPrivateDocument({
        docketEntryId: '123',
        documentType: 'Order',
        isOnDocketRecord: true,
        isStricken: true,
      });
      expect(isPrivate).toEqual(true);
    });
  });

  it('should compute docketNumberWithSuffix if it is not provided', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        contactPrimary: {},
        contactSecondary: {},
        createdAt: '2020-01-02T03:30:45.007Z',
        docketEntries: [{}],
        docketNumber: '102-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY,
        docketNumberWithSuffix: null,
        petitioners: [{ contactType: CONTACT_TYPES.primary }],
        receivedAt: '2020-01-05T03:30:45.007Z',
      },
      { applicationContext },
    );
    expect(entity.docketNumberWithSuffix).toBe('102-20SL');
  });

  it('should compute docketNumberWithSuffix with just docketNumber if there is no suffix', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        contactPrimary: {},
        contactSecondary: {},
        createdAt: '2020-01-02T03:30:45.007Z',
        docketEntries: [{}],
        docketNumber: '102-20',
        docketNumberSuffix: null,
        docketNumberWithSuffix: null,
        petitioners: [{ contactType: CONTACT_TYPES.primary }],
        receivedAt: '2020-01-05T03:30:45.007Z',
      },
      { applicationContext },
    );
    expect(entity.docketNumberWithSuffix).toBe('102-20');
  });

  it('should correctly ingest a complex case', () => {
    const entity = new PublicCase(MOCK_COMPLEX_CASE, { applicationContext });

    expect(() => entity.validate()).not.toThrow();
    expect(() => entity.validateForMigration()).not.toThrow();
  });

  it('should consider a public case to be sealed and valid when it has minimal information', () => {
    const entity = new PublicCase(
      {
        docketNumber: '17000-15',
        docketNumberSuffix: 'W',
        petitioners: [{ contactType: CONTACT_TYPES.primary }],
        sealedDate: 'some date',
      },
      { applicationContext },
    );

    expect(entity.isSealed).toBe(true);
    expect(() => {
      entity.validate();
    }).not.toThrow();
  });

  it('should consider a public case to be sealed and not valid if there exists a sealed docket entry on the docket record', () => {
    const entity = new PublicCase(
      {
        docketEntries: [{ isOnDocketRecord: true, isSealed: true }],
        docketNumber: '17000-15',
        petitioners: [{ contactType: CONTACT_TYPES.primary }],
      },
      { applicationContext },
    );
    expect(entity.isSealed).toBe(true);
    expect(entity.docketEntries.length).toBe(1);

    let error;
    try {
      entity.validate();
    } catch (err) {
      error = err;
    }
    expect(error.details).toMatchObject({
      docketEntries: expect.anything(),
      isSealed: expect.anything(),
    });
  });

  describe('irsPractitioner', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'],
      );
    });

    it('an irsPractitioner should be able to see otherPetitioners and otherFilers', () => {
      const mockOtherFiler = {
        address1: '42 Lamb Sauce Blvd',
        city: 'Nashville',
        contactType: CONTACT_TYPES.participant,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'gordon@example.com',
        name: 'Gordon Ramsay',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
        title: UNIQUE_OTHER_FILER_TYPE,
      };
      const mockOtherPetitioner = {
        address1: '42 Lamb Sauce Blvd',
        city: 'Nashville',
        contactType: CONTACT_TYPES.otherPetitioner,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'gordon@example.com',
        name: 'Gordon Ramsay',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
        title: UNIQUE_OTHER_FILER_TYPE,
      };

      const entity = new PublicCase(
        {
          caseCaption: 'testing',
          contactPrimary: {},
          contactSecondary: {},
          createdAt: '2020-01-02T03:30:45.007Z',
          docketEntries: [{}],
          docketNumber: '102-20',
          docketNumberSuffix: null,
          docketNumberWithSuffix: null,
          irsPractitioners: [],
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            { contactType: CONTACT_TYPES.primary },
            mockOtherFiler,
            mockOtherPetitioner,
          ],
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
        { applicationContext },
      );

      expect(entity.petitioners).toEqual(
        expect.arrayContaining([
          expect.objectContaining(mockOtherFiler),
          expect.objectContaining(mockOtherPetitioner),
        ]),
      );
      expect(entity.irsPractitioners).toBeTruthy();
    });

    it('should show all contact and practitioner information if user has IRS Practitioner role', () => {
      applicationContext.getCurrentUser.mockReturnValueOnce({
        role: ROLES.irsPractitioner,
      });

      const rawContactPrimary = {
        address1: '907 West Rocky Cowley Parkway',
        address2: '104 West 120th Street',
        address3: 'Nisi quisquam ea har',
        city: 'Ut similique id erro',
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        isAddressSealed: false,
        name: 'Garrett Carpenter',
        phone: '+1 (241) 924-9153',
        postalCode: '26371',
        sealedAndUnavailable: false,
        secondaryName: 'Leslie Bullock',
        state: 'MD',
      };
      const rawCase = {
        caseCaption: 'testing',
        contactSecondary: {
          address1: '907 West Rocky Cowley Parkway',
          address2: '104 West 120th Street',
          address3: 'Nisi quisquam ea har',
          city: 'Ut similique id erro',
          contactId: '7115d1ab-18d0-43ec-bafb-654e83405416',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          isAddressSealed: false,
          name: 'Barrett Carpenter',
          phone: '+1 (241) 924-9153',
          postalCode: '26371',
          sealedAndUnavailable: false,
          secondaryName: 'Leslie Bullock',
          state: 'MD',
        },
        docketEntries: [],
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        irsPractitioners: [
          {
            barNumber: 'RT6789',
            contact: {
              address1: '234 Main St',
              address2: 'Apartment 4',
              address3: 'Under the stairs',
              city: 'Chicago',
              countryType: 'domestic',
              phone: '+1 (555) 555-5555',
              postalCode: '61234',
              state: 'IL',
            },
            email: 'irsPractitioner@example.com',
            entityName: 'IrsPractitioner',
            name: 'Test IRS Practitioner',
            role: 'irsPractitioner',
            serviceIndicator: 'Electronic',
            userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          {
            ...rawContactPrimary,
            contactType: CONTACT_TYPES.primary,
            isPaper: true,
          },
          {
            address1: '907 West Rocky Cowley Parkway',
            address2: '104 West 120th Street',
            address3: 'Nisi quisquam ea har',
            city: 'Ut similique id erro',
            contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            contactType: CONTACT_TYPES.otherFiler,
            countryType: 'domestic',
            email: 'petitioner@example.com',
            isAddressSealed: false,
            name: 'Barrett Carpenter',
            phone: '+1 (241) 924-9153',
            postalCode: '26371',
            sealedAndUnavailable: false,
            secondaryName: 'Leslie Bullock',
            state: 'MD',
          },
        ],
        privatePractitioners: [
          {
            barNumber: 'PT1234',
            contact: {
              address1: '234 Main St',
              address2: 'Apartment 4',
              address3: 'Under the stairs',
              city: 'Chicago',
              countryType: 'domestic',
              phone: '+1 (555) 555-5555',
              postalCode: '61234',
              state: 'IL',
            },
            email: 'privatePractitioner@example.com',
            entityName: 'PrivatePractitioner',
            name: 'Test Private Practitioner',
            representing: ['28cae029-bae2-4eef-ac54-878fbbab65e3'],
            role: 'privatePractitioner',
            serviceIndicator: 'Electronic',
            userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        receivedAt: 'testing',
      };
      const entity = new PublicCase(rawCase, { applicationContext });

      expect(entity.toRawObject()).toMatchObject({
        ...omit(rawCase, 'contactSecondary'),
        caseCaption: 'testing',
        docketEntries: [],
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        docketNumberWithSuffix: 'testingtesting',
        hasIrsPractitioner: true,
        isSealed: false,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: rawCase.petitioners,
        receivedAt: 'testing',
      });
    });

    it('should not show practitioner and other filer information if user has IRS Practitioner role and the case is sealed', () => {
      applicationContext.getCurrentUser.mockReturnValueOnce({
        role: ROLES.irsPractitioner,
      });

      const rawCase = {
        caseCaption: 'testing',
        docketEntries: [],
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        irsPractitioners: [
          {
            userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        isSealed: true,
        otherFilers: [
          {
            contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          { contactType: CONTACT_TYPES.primary },
          {
            contactId: '9905d1ab-18d0-43ec-bafb-654e83405416',
            contactType: CONTACT_TYPES.otherPetitioner,
          },
        ],
        privatePractitioners: [
          {
            userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        receivedAt: 'testing',
      };
      const entity = new PublicCase(rawCase, { applicationContext });

      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.otherFilers).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
    });
  });
});

import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
  UNIQUE_OTHER_FILER_TYPE,
} from '../EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_COMPLEX_CASE } from '../../../test/mockComplexCase';
import { MOCK_USERS } from '../../../test/mockUsers';
import { PublicCase } from './PublicCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getContactSecondary } from './Case';

describe('PublicCase', () => {
  const mockContactId = 'b430f7f9-06f3-4a25-915d-5f51adab2f29';
  const mockContactIdSecond = '39a359e9-dde3-409e-b40e-77a4959b6f2c';

  it('should throw an error when applicationContext is not provided to the constructor', () => {
    expect(() => new PublicCase({}, {} as any)).toThrow(TypeError);
  });

  describe('validation', () => {
    it('should validate when all information is provided and case is not sealed', () => {
      const entity = new PublicCase(
        {
          caseCaption: 'testing',
          createdAt: '2020-01-02T03:30:45.007Z',
          docketEntries: [{}],
          docketNumber: '101-20',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          filedByRole: ROLES.petitioner,
          irsPractitioners: [{ name: 'Bob' }],
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            {
              contactId: mockContactId,
              contactType: CONTACT_TYPES.primary,
            },
          ],
          receivedAt: '2020-01-05T03:30:45.007Z',
          status: CASE_STATUS_TYPES.calendared,
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
        canAllowDocumentService: true,
        canAllowPrintableDocketRecord: false,
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
        status: CASE_STATUS_TYPES.new,
      },
      { applicationContext },
    );

    expect(entity.toRawObject()).toEqual({
      canAllowDocumentService: true,
      canAllowPrintableDocketRecord: false,
      caseCaption: 'testing',
      createdAt: 'testing',
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
          name: undefined,
          state: undefined,
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
        status: CASE_STATUS_TYPES.calendared,
      },
      { applicationContext },
    );

    expect(entity.toRawObject()).toEqual({
      canAllowDocumentService: undefined,
      canAllowPrintableDocketRecord: undefined,
      caseCaption: 'testing',
      createdAt: 'testing',
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
          name: undefined,
          state: undefined,
        },
      ],
      receivedAt: 'testing',
    });
  });

  it('should filter draft docketEntries out of the docketEntries array', () => {
    const entity = new PublicCase(
      {
        ...MOCK_CASE,
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
      },
      { applicationContext },
    );

    expect(entity.toRawObject().docketEntries).toMatchObject([
      {
        docketEntryId: '123',
        documentType: 'Order that case is assigned',
        isMinuteEntry: false,
        isOnDocketRecord: true,
      },
    ]);
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
        ...MOCK_CASE,
        docketEntries: [docketEntry1, docketEntry2, docketEntry3],
      },
      { applicationContext },
    );

    expect(entity.docketEntries).toMatchObject([
      { documentTitle: docketEntry3.documentTitle },
      { documentTitle: docketEntry2.documentTitle },
      { documentTitle: docketEntry1.documentTitle },
    ]);
  });

  it('should compute docketNumberWithSuffix if it is not provided', () => {
    const entity = new PublicCase(
      {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY,
        docketNumberWithSuffix: null,
      },
      { applicationContext },
    );
    expect(entity.docketNumberWithSuffix).toBe('102-20SL');
  });

  it('should compute docketNumberWithSuffix with just docketNumber if there is no suffix', () => {
    const entity = new PublicCase(
      {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketNumberSuffix: null,
        docketNumberWithSuffix: null,
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

  it('should not show leadDocketNumber if user is does not have IRS Practitioner role', () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: ROLES.privatePractitioner,
    });

    const rawCase = {
      ...MOCK_CASE,
      irsPractitioners: [
        {
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isSealed: false,
      leadDocketNumber: 'number',
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
    };
    const entity = new PublicCase(rawCase, { applicationContext });

    expect(entity.irsPractitioners).toBeUndefined();
    expect(entity.privatePractitioners).toBeUndefined();
    expect(entity.leadDocketNumber).toBeUndefined();
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
          ...MOCK_CASE,
          petitioners: [
            { contactType: CONTACT_TYPES.primary },
            mockOtherFiler,
            mockOtherPetitioner,
          ],
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
            email: 'irspractitioner@example.com',
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
        ...MOCK_CASE,
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
      };
      const entity = new PublicCase(rawCase, { applicationContext });

      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
    });
  });

  it('should show leadDocketNumber if user is has IRS Practitioner role', () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: ROLES.irsPractitioner,
    });

    const rawCase = {
      ...MOCK_CASE,
      irsPractitioners: [
        {
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isSealed: false,
      leadDocketNumber: 'number',
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
    };
    const entity = new PublicCase(rawCase, { applicationContext });

    expect(entity.irsPractitioners).toBeDefined();
    expect(entity.privatePractitioners).toBeDefined();
    expect(entity.leadDocketNumber).toBeDefined();
  });
  // eslint-disable-next-line max-lines
});

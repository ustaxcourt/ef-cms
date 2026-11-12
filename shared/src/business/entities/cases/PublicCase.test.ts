/* eslint-disable max-lines */
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
import { PublicCase } from './PublicCase';
import { getContactSecondary } from './Case';
import { mockIrsPractitionerUser } from '@shared/test/mockAuthUsers';

describe('PublicCase', () => {
  const mockContactId = 'b430f7f9-06f3-4a25-915d-5f51adab2f29';
  const mockContactIdSecond = '39a359e9-dde3-409e-b40e-77a4959b6f2c';

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
        { authorizedUser: undefined },
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
        { authorizedUser: undefined },
      );

      expect(entity.getFormattedValidationErrors()).toMatchObject({
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
        leadDocketNumber: '101-24',
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
      { authorizedUser: undefined },
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
      irsPractitioners: [],
      isPaper: true,
      isSealed: false,
      leadDocketNumber: '101-24',
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
      privatePractitioners: [],
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
      { authorizedUser: undefined },
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
      irsPractitioners: [],
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

  describe('docketEntries filtering and sorting', () => {
    it('should handle empty docketEntries array', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          docketEntries: [],
        },
        { authorizedUser: undefined },
      );

      expect(entity.docketEntries).toEqual([]);
    });

    it('should filter out entries that are drafts', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          docketEntries: [
            { docketEntryId: '1', isDraft: true, isOnDocketRecord: true },
            { docketEntryId: '2', isDraft: false, isOnDocketRecord: true },
          ],
        },
        { authorizedUser: undefined },
      );

      expect(entity.docketEntries).toHaveLength(1);
      expect(entity.docketEntries[0].docketEntryId).toBe('2');
    });

    it('should filter out entries that are not on docket record', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          docketEntries: [
            { docketEntryId: '1', isDraft: false, isOnDocketRecord: false },
            { docketEntryId: '2', isDraft: false, isOnDocketRecord: true },
          ],
        },
        { authorizedUser: undefined },
      );

      expect(entity.docketEntries).toHaveLength(1);
      expect(entity.docketEntries[0].docketEntryId).toBe('2');
    });

    it('should handle both filter conditions together', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          docketEntries: [
            { docketEntryId: '1', isDraft: true, isOnDocketRecord: true },
            { docketEntryId: '2', isDraft: true, isOnDocketRecord: false },
            { docketEntryId: '3', isDraft: false, isOnDocketRecord: false },
            { docketEntryId: '4', isDraft: false, isOnDocketRecord: true },
            { docketEntryId: '5', isDraft: false, isOnDocketRecord: true },
          ],
        },
        { authorizedUser: undefined },
      );

      expect(entity.docketEntries).toHaveLength(2);
      expect(
        entity.docketEntries.map((entry: any) => entry.docketEntryId),
      ).toEqual(['4', '5']);
    });

    it('should handle when entries have no receivedAt or docketEntryId for sorting', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          docketEntries: [
            { isDraft: false, isOnDocketRecord: true },
            { docketEntryId: 'a', isDraft: false, isOnDocketRecord: true },
          ],
        },
        { authorizedUser: undefined },
      );

      expect(entity.docketEntries).toHaveLength(2);
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
            isOnDocketRecord: true,
          },
          { docketEntryId: '234', documentType: 'Order', isDraft: true },
          { docketEntryId: '345', documentType: 'Petition' },
          { docketEntryId: '987', eventCode: TRANSCRIPT_EVENT_CODE },
        ],
      },
      { authorizedUser: undefined },
    );

    expect(entity.toRawObject().docketEntries).toMatchObject([
      {
        docketEntryId: '123',
        documentType: 'Order that case is assigned',
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
      { authorizedUser: undefined },
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
      { authorizedUser: undefined },
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
      { authorizedUser: undefined },
    );
    expect(entity.docketNumberWithSuffix).toBe('102-20');
  });

  it('should correctly ingest a complex case', () => {
    const entity = new PublicCase(MOCK_COMPLEX_CASE, {
      authorizedUser: undefined,
    });

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
      { authorizedUser: undefined },
    );

    expect(entity.isSealed).toBe(true);
    expect(() => {
      entity.validate();
    }).not.toThrow();
  });

  describe('sealed case with different user roles', () => {
    it('should skip both if and else if branches when case is sealed regardless of user role', () => {
      const sealedCaseData = {
        ...MOCK_CASE,
        docketEntries: [
          {
            docketEntryId: '1',
            isDraft: false,
            isOnDocketRecord: true,
            receivedAt: '2024-03-01T00:00:00.000Z',
          },
        ],
        irsPractitioners: [{ userId: '123', name: 'IRS' }],
        privatePractitioners: [{ userId: '456', name: 'Private' }],
        petitioners: [
          { contactType: CONTACT_TYPES.primary, name: 'Petitioner' },
        ],
        isSealed: true,
      };

      const entity = new PublicCase(sealedCaseData, {
        authorizedUser: undefined,
      });

      expect(entity.isSealed).toBe(true);
      expect(entity.petitioners).toBeUndefined();
      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
      expect(entity.docketEntries).toHaveLength(1);
    });

    it('should skip both branches for irsPractitioner user when case is sealed', () => {
      const sealedCaseData = {
        ...MOCK_CASE,
        docketEntries: [
          {
            docketEntryId: '1',
            isDraft: false,
            isOnDocketRecord: true,
            receivedAt: '2024-03-01T00:00:00.000Z',
          },
        ],
        irsPractitioners: [
          { userId: '123', name: 'IRS', role: ROLES.irsPractitioner },
        ],
        privatePractitioners: [{ userId: '456', name: 'Private' }],
        petitioners: [
          { contactType: CONTACT_TYPES.primary, name: 'Petitioner' },
        ],
        isSealed: true,
      };

      const entity = new PublicCase(sealedCaseData, {
        authorizedUser: mockIrsPractitionerUser,
      });

      expect(entity.isSealed).toBe(true);
      expect(entity.petitioners).toBeUndefined();
      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
    });
  });

  describe('sealed case handling', () => {
    it('should not include practitioner information for sealed cases even when user is an irsPractitioner', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          irsPractitioners: [{ name: 'Test IRS' }],
          privatePractitioners: [{ name: 'Test Private' }],
          petitioners: [
            { contactType: CONTACT_TYPES.primary, name: 'Test Petitioner' },
          ],
          sealedDate: '2020-01-05T03:30:45.007Z',
        },
        { authorizedUser: mockIrsPractitionerUser },
      );

      expect(entity.isSealed).toBe(true);
      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
      expect(entity.petitioners).toBeUndefined();
    });

    it('should not include practitioner information for sealed cases when user is not an irsPractitioner', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          irsPractitioners: [{ name: 'Test IRS' }],
          privatePractitioners: [{ name: 'Test Private' }],
          petitioners: [
            { contactType: CONTACT_TYPES.primary, name: 'Test Petitioner' },
          ],
          sealedDate: '2020-01-05T03:30:45.007Z',
        },
        { authorizedUser: undefined },
      );

      expect(entity.isSealed).toBe(true);
      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
      expect(entity.petitioners).toBeUndefined();
    });

    it('should handle undefined practitioner arrays for non-sealed cases', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          irsPractitioners: undefined,
          privatePractitioners: undefined,
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        { authorizedUser: undefined },
      );

      expect(entity.petitioners).toBeDefined();
      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
    });

    it('should handle empty practitioner arrays for non-sealed cases', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          irsPractitioners: [],
          privatePractitioners: [],
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        { authorizedUser: undefined },
      );

      expect(entity.petitioners).toBeDefined();
      expect(entity.irsPractitioners).toEqual([]);
      expect(entity.privatePractitioners).toEqual([]);
    });

    it('should map practitioner arrays through PublicContact for non-sealed cases with non-IRS-Practitioner user', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          irsPractitioners: [
            { userId: '123', name: 'IRS Practitioner', address1: '100 IRS St' },
          ],
          privatePractitioners: [
            {
              userId: '456',
              name: 'Private Practitioner',
              address1: '200 Private Ave',
            },
          ],
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              name: 'Primary Petitioner',
              address1: '300 Main St',
            },
            {
              contactType: CONTACT_TYPES.secondary,
              name: 'Secondary Petitioner',
              address1: '400 Second St',
            },
          ],
        },
        { authorizedUser: undefined },
      );

      expect(entity.petitioners).toHaveLength(2);
      expect(entity.irsPractitioners).toHaveLength(1);
      expect(entity.privatePractitioners).toHaveLength(1);
      expect(entity.petitioners?.[0]).toHaveProperty(
        'entityName',
        'PublicContact',
      );
      expect(entity.irsPractitioners?.[0]).toHaveProperty(
        'entityName',
        'PublicContact',
      );
      expect(entity.privatePractitioners?.[0]).toHaveProperty(
        'entityName',
        'PublicContact',
      );
    });

    it('should handle consolidatedCases for irsPractitioner users on non-sealed cases', () => {
      const mockConsolidatedCase = {
        caseCaption: 'Consolidated Test',
        docketNumber: '999-99',
      };

      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          consolidatedCases: [mockConsolidatedCase],
          irsPractitioners: [{ name: 'Test IRS' }],
        },
        { authorizedUser: mockIrsPractitionerUser },
      );

      expect(entity.consolidatedCases).toBeDefined();
      expect(entity.consolidatedCases).toHaveLength(1);
    });

    it('should handle undefined consolidatedCases for irsPractitioner users', () => {
      const entity = new PublicCase(
        {
          ...MOCK_CASE,
          consolidatedCases: undefined,
          irsPractitioners: [{ name: 'Test IRS' }],
        },
        { authorizedUser: mockIrsPractitionerUser },
      );

      expect(entity.consolidatedCases).toBeDefined();
      expect(entity.consolidatedCases).toHaveLength(0);
    });
  });

  describe('irsPractitioner', () => {
    it('an irsPractitioner should be able to see otherPetitioners and otherFilers', () => {
      const mockOtherFiler = {
        address1: '42 Lamb Sauce Blvd',
        city: 'Nashville',
        contactType: CONTACT_TYPES.participant,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'gordon@example.com',
        name: 'Saturnino Nao',
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
        name: 'Saturnino Nao',
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
        { authorizedUser: mockIrsPractitionerUser },
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
      const entity = new PublicCase(rawCase, {
        authorizedUser: mockIrsPractitionerUser,
      });

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
      const entity = new PublicCase(rawCase, {
        authorizedUser: mockIrsPractitionerUser,
      });

      expect(entity.irsPractitioners).toBeUndefined();
      expect(entity.privatePractitioners).toBeUndefined();
    });
  });
});

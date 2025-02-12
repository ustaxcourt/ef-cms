import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
} from '../entities/EntityConstants';
import {
  filterCaseSearchResultsNotAccessibleToUser,
  formatSealedAddresses,
} from './caseFilter';
import {
  mockIrsPractitionerUser,
  mockIrsSuperuser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

describe('caseFilter', () => {
  describe('caseContactAddressSealedFormatter', () => {
    it('returns contact info with ONLY the whitelisted attributes present', () => {
      const createContactInfo = () => ({
        additionalName: 'Bob',
        address1: '123 Sesame Street',
        bananas: '8-foot bunch',
        city: 'Los Angeles',
        contactId: '42-universe-everything',
        countryType: COUNTRY_TYPES.DOMESTIC,
        entityName: 'Petitioner',
        inCareOf: 'Friendship is Magic',
        isAddressSealed: true,
        name: 'Joe Dirt',
        phone: 'N/A',
        postalCode: '11111',
        sealedAndUnavailable: false,
        secondaryName: 'Cheeseburgers',
        serviceIndicator: 'Electronic',
        state: 'IL',
        title: 'Emperor',
        transmission: 'manual',
      });
      const caseDetail = {} as Partial<RawCase>;
      caseDetail.petitioners = [
        { ...createContactInfo(), contactType: CONTACT_TYPES.primary },
        { ...createContactInfo(), contactType: CONTACT_TYPES.otherFiler },
        { ...createContactInfo(), contactType: CONTACT_TYPES.otherFiler },
        { ...createContactInfo(), contactType: CONTACT_TYPES.otherPetitioner },
        { ...createContactInfo(), contactType: CONTACT_TYPES.otherPetitioner },
        { ...createContactInfo(), contactType: CONTACT_TYPES.secondary },
      ];

      const result = formatSealedAddresses(caseDetail, {
        role: ROLES.petitioner,
        userId: '1234',
        name: 'Test',
        email: 'test@test.com',
      });

      result.petitioners.forEach(party => {
        expect(Object.keys(party).sort()).toMatchObject([
          'additionalName',
          'contactId',
          'contactType',
          'inCareOf',
          'isAddressSealed',
          'name',
          'sealedAndUnavailable',
          'secondaryName',
          'serviceIndicator',
          'title',
        ]);
      });
    });
  });

  describe('caseSearchFilter', () => {
    const unsealedDocketEntryId = '1f1aa3f7-e2e3-43e6-885d-4ce341588c79';
    const documentSearchResults = [
      {
        caseCaption: 'Luksa Lucia, Petitioner',
        docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
        docketNumber: '104-17',
        docketNumberWithSuffix: '104-17R',
        documentTitle:
          'Sealed Order of Dismissal and Decision Entered, Judge Buch',
        documentType: 'Order of Dismissal and Decision',
        eventCode: 'ODD',
        filingDate: '2020-04-14T03:01:50.746Z',
        irsPractitioners: [],
        isCaseSealed: false,
        isDocketEntrySealed: true,
        isStricken: false,
        privatePractitioners: [{ userId: 'associatedPractitioner' }],
        signedJudgeName: 'Maurice B. Foley',
      },
      {
        caseCaption: 'Luksa Lucia, Petitioner',
        docketEntryId: unsealedDocketEntryId,
        docketNumber: '104-17',
        docketNumberWithSuffix: '104-17R',
        documentTitle:
          'Unsealed Order of Dismissal and Decision Entered, Judge Buch',
        documentType: 'Order of Dismissal and Decision',
        eventCode: 'ODD',
        filingDate: '2020-04-14T03:01:50.746Z',
        irsPractitioners: [],
        isCaseSealed: false,
        isDocketEntrySealed: false,
        isStricken: false,
        privatePractitioners: [],
        signedJudgeName: 'Maurice B. Foley',
      },
    ];

    const caseSearchResults = [
      {
        baz: 'quux',
        docketEntries: [{ documentType: 'Petition' }],
        docketNumber: '101-20',
        foo: 'baz',
        petitioners: [],
        sealedDate: undefined,
      },
      {
        baz: 'quux',
        docketEntries: [{ documentType: 'Petition' }],
        docketNumber: '102-20',
        foo: 'bar',
        irsPractitioners: [{ userId: 'authRespondent' }],
        petitioners: [],
        privatePractitioners: [{ userId: 'authPractitioner' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
      {
        baz: 'quux',
        docketEntries: [
          { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
        ],
        docketNumber: '102-20',
        foo: 'bar',
        irsPractitioners: [{ userId: 'authRespondent' }],
        petitioners: [
          {
            address1: '1 Eagle Way',
            city: 'Hotel California',
            contactType: CONTACT_TYPES.primary,
            isAddressSealed: true,
            name: 'Joe Walsh',
            state: 'CA',
          },
        ],
        privatePractitioners: [{ userId: 'authPractitioner' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
      {
        docketEntries: [
          {
            documentType: 'Petition',
            isLegacySealed: true,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '120-20',
        petitioners: [],
      },
    ];

    it('should remove sealed cases from a set of advanced search results', () => {
      const result = filterCaseSearchResultsNotAccessibleToUser(
        caseSearchResults,
        mockIrsPractitionerUser,
      );

      expect(result).toMatchObject([
        {
          docketNumber: '101-20',
          sealedDate: undefined,
        },
        {
          docketNumber: '120-20',
        },
      ]);
    });

    it('should format sealed addresses in search results if user does not have permission to see sealed contact addresses', () => {
      const result = filterCaseSearchResultsNotAccessibleToUser(
        caseSearchResults,
        mockPetitionsClerkUser,
      );

      expect(result.length).toEqual(4);
      expect(result[2].petitioners[0]).toMatchObject({
        isAddressSealed: true,
        name: 'Joe Walsh',
        sealedAndUnavailable: true,
      });
    });

    it('should keep sealed cases in search results if user is an internal user with permission to see sealed cases', () => {
      const result = filterCaseSearchResultsNotAccessibleToUser(
        caseSearchResults,
        mockPetitionsClerkUser,
      );

      expect(result.length).toEqual(4);
    });

    it('should keep sealed cases in search results if user is an IRS superuser with permission to see sealed cases', () => {
      const result = filterCaseSearchResultsNotAccessibleToUser(
        caseSearchResults,
        mockIrsSuperuser,
      );

      expect(result.length).toEqual(4);
    });

    it('should keep sealed cases in search results if user is associated as practitioner or respondent', () => {
      let result = filterCaseSearchResultsNotAccessibleToUser(
        caseSearchResults,
        {
          ...mockPrivatePractitionerUser,
          userId: 'authPractitioner',
        },
      );

      expect(result.length).toEqual(4);

      result = filterCaseSearchResultsNotAccessibleToUser(caseSearchResults, {
        ...mockPrivatePractitionerUser,
        userId: 'authRespondent',
      });

      expect(result.length).toEqual(4);
    });

    it('should filter out sealed documents in search results when the user is not associated with the case', () => {
      const result = filterCaseSearchResultsNotAccessibleToUser(
        documentSearchResults,
        mockPrivatePractitionerUser,
      );

      expect(result.length).toEqual(1);
      expect(result[0].docketEntryId).toEqual(unsealedDocketEntryId);
    });

    it('should NOT filter out sealed documents in search results when the user is associated with the case', () => {
      const result = filterCaseSearchResultsNotAccessibleToUser(
        documentSearchResults,
        {
          ...mockPrivatePractitionerUser,
          userId: 'associatedPractitioner',
        },
      );

      expect(result.length).toEqual(2);
    });
  });
});

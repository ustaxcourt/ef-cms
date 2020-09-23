const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
  caseSearchFilter,
} = require('./caseFilter');
const {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} = require('../entities/EntityConstants');

describe('caseFilter', () => {
  it('should format sealed cases to preserve ONLY attributes appearing in a whitelist', () => {
    const result = caseSealedFormatter({
      baz: 'quux',
      docketNumber: '102-20',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      foo: 'bar',
      sealedDate: '2020-01-02T03:04:05.007Z',
    });

    expect(result).toEqual({
      docketNumber: '102-20',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      sealedDate: '2020-01-02T03:04:05.007Z',
    });
  });

  describe('caseContactAddressSealedFormatter', () => {
    it('returns contact info with ONLY the whitelisted attributes present', () => {
      const createContactInfo = () => ({
        additionalName: 'Bob',
        bananas: '8-foot bunch',
        city: 'Los Angeles',
        contactId: '42-universe-everything',
        inCareOf: 'Friendship is Magic',
        isAddressSealed: true,
        name: 'Joe Dirt',
        otherFilerType: 'Nail File',
        secondaryName: 'Cheeseburgers',
        title: 'Emperor',
        transmission: 'manual',
      });
      const caseDetail = {};
      caseDetail.contactPrimary = createContactInfo();
      caseDetail.contactSecondary = createContactInfo();
      caseDetail.otherFilers = [createContactInfo(), createContactInfo()];
      caseDetail.otherPetitioners = [createContactInfo(), createContactInfo()];

      const result = caseContactAddressSealedFormatter(caseDetail, {
        role: ROLES.petitioner,
      });
      [
        result.contactPrimary,
        result.contactSecondary,
        ...result.otherFilers,
        ...result.otherPetitioners,
      ].forEach(party => {
        expect(Object.keys(party).sort()).toMatchObject([
          'additionalName',
          'contactId',
          'inCareOf',
          'isAddressSealed',
          'name',
          'otherFilerType',
          'sealedAndUnavailable',
          'secondaryName',
          'title',
        ]);
      });
    });
  });

  describe('caseSearchFilter', () => {
    const caseSearchResults = [
      {
        baz: 'quux',
        docketEntries: [{ documentType: 'Petition' }],
        docketNumber: '101-20',
        foo: 'baz',
        sealedDate: undefined,
      },
      {
        baz: 'quux',
        docketEntries: [{ documentType: 'Petition' }],
        docketNumber: '102-20',
        foo: 'bar',
        irsPractitioners: [{ userId: 'authRespondent' }],
        privatePractitioners: [{ userId: 'authPractitioner' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
      {
        baz: 'quux',
        contactPrimary: {
          address1: '1 Eagle Way',
          city: 'Hotel California',
          isAddressSealed: true,
          name: 'Joe Walsh',
          state: 'CA',
        },
        docketEntries: [
          { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
        ],
        docketNumber: '102-20',
        foo: 'bar',
        irsPractitioners: [{ userId: 'authRespondent' }],
        privatePractitioners: [{ userId: 'authPractitioner' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
    ];

    it('should remove sealed cases from a set of advanced search results', () => {
      const result = caseSearchFilter(caseSearchResults, {
        role: ROLES.irsPractitioner,
        userId: 'some other respondent',
      });

      expect(result.length).toEqual(1);
      expect(result[0]).toMatchObject({
        docketNumber: '101-20',
        sealedDate: undefined,
      });
    });

    it('should format sealed addresses in search results if user does not have permission to see sealed contact addresses', () => {
      let result = caseSearchFilter(caseSearchResults, {
        role: ROLES.petitionsClerk,
        userId: 'petitionsClerk',
      });

      expect(result.length).toEqual(3);
      expect(result[2].contactPrimary).toMatchObject({
        isAddressSealed: true,
        name: 'Joe Walsh',
        sealedAndUnavailable: true,
      });
    });

    it('should keep sealed cases in search results if user is an internal user with permission to see sealed cases', () => {
      let result = caseSearchFilter(caseSearchResults, {
        role: ROLES.petitionsClerk,
        userId: 'petitionsClerk',
      });

      expect(result.length).toEqual(3);
    });

    it('should keep sealed cases in search results if user is an IRS superuser with permission to see sealed cases', () => {
      let result = caseSearchFilter(caseSearchResults, {
        role: ROLES.irsSuperuser,
        userId: 'irsSuperuser',
      });

      expect(result.length).toEqual(3);
    });

    it('should keep sealed cases in search results if user is associated as practitioner or respondent', () => {
      let result = caseSearchFilter(caseSearchResults, {
        userId: 'authPractitioner',
      });

      expect(result.length).toEqual(3);

      result = caseSearchFilter(caseSearchResults, {
        userId: 'authRespondent',
      });

      expect(result.length).toEqual(3);
    });
  });
});

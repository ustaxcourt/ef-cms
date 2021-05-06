const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  INITIAL_DOCUMENT_TYPES,
  OTHER_FILER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const { Case, getContactPrimary, getPetitionDocketEntry } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');
const { Correspondence } = require('../Correspondence');
const { IrsPractitioner } = require('../IrsPractitioner');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { PrivatePractitioner } = require('../PrivatePractitioner');
const { Statistic } = require('../Statistic');
const { TrialSession } = require('../trialSessions/TrialSession');

describe('Case entity', () => {
  it('should throw an error if app context is not passed in', () => {
    expect(() => new Case({}, {})).toThrow();
  });

  it('defaults the orders to false', () => {
    const myCase = new Case(MOCK_CASE, { applicationContext });

    expect(myCase).toMatchObject({
      isSealed: false,
      noticeOfAttachments: false,
      orderDesignatingPlaceOfTrial: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
    });
  });

  it('sorts correspondence array according to `filingDate`', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        correspondence: [
          { filingDate: '2020-01-05T01:02:03.004Z' },
          { filingDate: '2019-01-05T01:02:03.004Z' },
        ],
      },
      { applicationContext },
    );

    expect(myCase.correspondence).toMatchObject([
      { filingDate: '2019-01-05T01:02:03.004Z' },
      { filingDate: '2020-01-05T01:02:03.004Z' },
    ]);
  });

  it('should NOT populate additionalName when case has NOT been served', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            secondaryName: 'Test Secondary Name',
            title: 'Test Title',
          },
        ],
        status: CASE_STATUS_TYPES.new,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBeUndefined();
  });

  it('should populate additionalName when case has been served', () => {
    const mockSecondaryName = 'Test Secondary Name';
    const mockTitle = 'Test Title';

    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            additionalName: undefined,
            secondaryName: mockSecondaryName,
            title: mockTitle,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBeDefined();
  });

  describe('archivedDocketEntries', () => {
    let myCase;

    beforeEach(() => {
      myCase = new Case(
        {
          ...MOCK_CASE,
        },
        { applicationContext },
      );
    });

    it('should not populate archivedDocketEntries when the user is an external user and filtered is true', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //petitioner user

      myCase = new Case(
        {
          ...MOCK_CASE,
          archivedDocketEntries: [...MOCK_DOCUMENTS],
        },
        { applicationContext, filtered: true },
      );

      expect(myCase.archivedDocketEntries).toBeUndefined();
    });

    it('should set archivedDocketEntries to the value provided when the user is an internal user', () => {
      myCase = new Case(
        {
          ...MOCK_CASE,
          archivedDocketEntries: [...MOCK_DOCUMENTS],
        },
        { applicationContext },
      );

      expect(myCase.archivedDocketEntries.length).toEqual(
        MOCK_DOCUMENTS.length,
      );
    });

    it('should set archivedDocketEntries to an empty list when a value is not provided and the user is an internal user', () => {
      expect(myCase.archivedDocketEntries).toEqual([]);
    });
  });

  describe('hearings', () => {
    it('sets associated hearings on the case hearings array, and make sure they are sorted by created date', () => {
      const mockhearing1 = {
        createdAt: '2024-03-01T00:00:00.000Z',
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      };
      const mockhearing2 = {
        createdAt: '2024-01-01T00:00:00.000Z',
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-01-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      };
      const mockhearing3 = {
        createdAt: '2024-02-01T00:00:00.000Z',
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-02-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      };

      const newCase = new Case(
        {
          ...MOCK_CASE,
          hearings: [mockhearing1, mockhearing2, mockhearing3],
        },
        { applicationContext },
      );

      expect(newCase.hearings[0].createdAt).toEqual(mockhearing2.createdAt);
      expect(newCase.hearings[1].createdAt).toEqual(mockhearing3.createdAt);
      expect(newCase.hearings[2].createdAt).toEqual(mockhearing1.createdAt);
    });

    it('sets the case hearings property to an empty object if none are provided', () => {
      const newCase = new Case(
        {
          ...MOCK_CASE,
        },
        { applicationContext },
      );

      expect(newCase.hearings).toEqual([]);
    });
  });

  describe('adding and removing practitioners', () => {
    let myCase;

    beforeEach(() => {
      myCase = new Case(
        {
          ...MOCK_CASE,
          irsPractitioners: [{ name: 'Christopher Walken', userId: '123' }],
          privatePractitioners: [{ name: 'Slim Shady', userId: '567' }],
        },
        { applicationContext },
      );
    });

    describe('who are from IRS', () => {
      it('updates a matching IRS practitioner found on the case', () => {
        expect(myCase.irsPractitioners.length).toEqual(1);

        myCase.updateIrsPractitioner({
          name: 'Christopher Running',
          userId: '123',
        });

        expect(myCase.irsPractitioners.length).toEqual(1);
        expect(myCase.irsPractitioners[0]).toMatchObject({
          name: 'Christopher Running',
        });
      });
      it('updates nothing when provided object does not match', () => {
        myCase.updateIrsPractitioner({
          name: 'Slow Jog',
          userId: '000-111-222',
        });

        expect(myCase.irsPractitioners.length).toEqual(1);
        expect(myCase.irsPractitioners[0]).toMatchObject({
          name: 'Christopher Walken',
        });
      });
    });

    describe('who are private', () => {
      it('updates a matching private practitioner found on the case', () => {
        expect(myCase.privatePractitioners.length).toEqual(1);

        myCase.updatePrivatePractitioner({
          name: 'Stout Sunny',
          userId: '567',
        });

        expect(myCase.privatePractitioners.length).toEqual(1);
        expect(myCase.privatePractitioners[0]).toMatchObject({
          name: 'Stout Sunny',
        });
      });
      it('updates nothing when provided object does not match', () => {
        myCase.updatePrivatePractitioner({
          name: 'Slow Jog',
          userId: '000-111-222',
        });

        expect(myCase.privatePractitioners.length).toEqual(1);
        expect(myCase.privatePractitioners[0]).toMatchObject({
          name: 'Slim Shady',
        });
      });
    });
  });

  it('sets the expected order booleans', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        noticeOfAttachments: true,
        orderDesignatingPlaceOfTrial: true,
        orderForAmendedPetition: false,
        orderForAmendedPetitionAndFilingFee: false,
        orderForFilingFee: true,
        orderForOds: false,
        orderForRatification: false,
        orderToShowCause: true,
      },
      {
        applicationContext,
      },
    );

    expect(myCase).toMatchObject({
      noticeOfAttachments: true,
      orderDesignatingPlaceOfTrial: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: true,
    });
  });

  describe('toRawObject', () => {
    beforeEach(() => {
      jest.spyOn(Case.prototype, 'doesHavePendingItems');
    });

    afterEach(() => {
      Case.prototype.doesHavePendingItems.mockRestore();
    });

    it('calls own function to update values after decorated toRawObject', () => {
      const myCase = new Case({}, { applicationContext });

      const result = myCase.toRawObject();

      expect(Case.prototype.doesHavePendingItems).toHaveBeenCalled();
      expect(result.hasPendingItems).toBeFalsy();
    });

    it('does not call own function to update values if flag is set to false after decorated toRawObject', () => {
      const myCase = new Case({}, { applicationContext });
      const result = myCase.toRawObject(false);

      expect(Case.prototype.doesHavePendingItems).not.toHaveBeenCalled();
      expect(result.hasPendingItems).toBeFalsy();
    });
  });

  describe('filtered', () => {
    it('does not return private data if filtered is true and the user is external', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //petitioner user

      const myCase = new Case(
        { ...MOCK_CASE, associatedJudge: CHIEF_JUDGE },
        {
          applicationContext,
          filtered: true,
        },
      );

      expect(Object.keys(myCase)).not.toContain('associatedJudge');
    });

    it('returns private data if filtered is true and the user is internal', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //docketclerk user

      const myCase = new Case(
        { ...MOCK_CASE, associatedJudge: CHIEF_JUDGE },
        {
          applicationContext,
          filtered: true,
        },
      );

      expect(Object.keys(myCase)).toContain('associatedJudge');
    });

    it('returns private data if filtered is false and the user is external', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //petitioner user

      const myCase = new Case(
        { ...MOCK_CASE, associatedJudge: CHIEF_JUDGE },
        {
          applicationContext,
          filtered: false,
        },
      );

      expect(Object.keys(myCase)).toContain('associatedJudge');
    });

    it('returns private data if filtered is false and the user is internal', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //docketclerk user

      const myCase = new Case(
        { ...MOCK_CASE, associatedJudge: CHIEF_JUDGE },
        {
          applicationContext,
          filtered: false,
        },
      );

      expect(Object.keys(myCase)).toContain('associatedJudge');
    });

    it('returns STIN docket entry if filtered is false and the user is docketclerk', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //docketclerk user

      const myCase = new Case(
        { ...MOCK_CASE },
        {
          applicationContext,
          filtered: false,
        },
      );

      const stinDocketEntry = myCase.docketEntries.find(
        d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
      );
      expect(stinDocketEntry).toBeDefined();
    });

    it('returns STIN docket entry if filtered is true and the user is IRS superuser', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['2eee98ac-613f-46bc-afd5-2574d1b15664'],
      ); //irsSuperuser user

      const myCase = new Case(
        { ...MOCK_CASE },
        {
          applicationContext,
          filtered: true,
        },
      );
      const stinDocketEntry = myCase.docketEntries.find(
        d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
      );

      expect(stinDocketEntry).toBeDefined();
    });

    it('returns STIN docket entry if filtered is true and the user is petitionsclerk and the petition is not served', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['c7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //petitionsclerk user

      const myCase = new Case(
        { ...MOCK_CASE },
        {
          applicationContext,
          filtered: true,
        },
      );
      const stinDocketEntry = myCase.docketEntries.find(
        d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
      );

      expect(stinDocketEntry).toBeDefined();
    });

    it('does not return STIN docket entry if filtered is true and the user is docketclerk and the petition is not served', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //docketclerk user

      const myCase = new Case(
        { ...MOCK_CASE },
        {
          applicationContext,
          filtered: true,
        },
      );

      const stinDocketEntry = myCase.docketEntries.find(
        d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
      );
      expect(stinDocketEntry).not.toBeDefined();
    });

    it('does not return STIN docket entry if filtered is true and the user is petitionsclerk and the petition is served', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['c7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //petitionsclerk user

      const myCase = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              docketNumber: '101-18',
              documentTitle: 'Petition',
              documentType: 'Petition',
              eventCode: 'P',
              filedBy: 'Test Petitioner',
              filingDate: '2018-03-01T00:01:00.000Z',
              index: 1,
              isFileAttached: true,
              isOnDocketRecord: true,
              processingStatus: 'complete',
              servedAt: '2018-11-21T20:49:28.192Z',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            MOCK_CASE.docketEntries.find(
              d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
            ),
          ],
        },
        {
          applicationContext,
          filtered: true,
        },
      );

      const stinDocketEntry = myCase.docketEntries.find(
        d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
      );
      expect(stinDocketEntry).not.toBeDefined();
    });
  });

  describe('Other Petitioners', () => {
    it('sets the value of otherPetitioners on the case', () => {
      const mockOtherPetitioners = [
        {
          additionalName: 'First Other Petitioner',
          address1: '876 12th Ave',
          city: 'Nashville',
          contactType: CONTACT_TYPES.otherPetitioner,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
        },
        {
          additionalName: 'First Other Petitioner',
          address1: '876 12th Ave',
          city: 'Nashville',
          contactType: CONTACT_TYPES.otherPetitioner,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [...MOCK_CASE.petitioners, ...mockOtherPetitioners],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getOtherPetitioners()).toMatchObject(mockOtherPetitioners);
    });
  });

  describe('Other Filers', () => {
    it('sets a valid value of otherFilers on the case', () => {
      const mockOtherFilers = [
        {
          address1: '42 Lamb Sauce Blvd',
          city: 'Nashville',
          contactType: CONTACT_TYPES.otherFiler,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'gordon@example.com',
          name: 'Gordon Ramsay',
          otherFilerType: UNIQUE_OTHER_FILER_TYPE,
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
        },
        {
          address1: '1337 12th Ave',
          city: 'Flavortown',
          contactType: CONTACT_TYPES.otherFiler,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'mayor@example.com',
          name: 'Guy Fieri',
          otherFilerType: OTHER_FILER_TYPES[1],
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [getContactPrimary(MOCK_CASE), ...mockOtherFilers],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getOtherFilers()).toMatchObject(mockOtherFilers);
    });

    it('fails validation with more than one unique filer type', () => {
      const mockOtherFilers = [
        {
          address1: '42 Lamb Sauce Blvd',
          city: 'Nashville',
          contactType: CONTACT_TYPES.otherFiler,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'gordon@example.com',
          name: 'Gordon Ramsay',
          otherFilerType: UNIQUE_OTHER_FILER_TYPE,
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
          title: UNIQUE_OTHER_FILER_TYPE,
        },
        {
          address1: '1337 12th Ave',
          city: 'Flavortown',
          contactType: CONTACT_TYPES.otherFiler,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'mayor@example.com',
          name: 'Guy Fieri',
          // fails because there cannot be more than 1 filer with this type
          otherFilerType: UNIQUE_OTHER_FILER_TYPE,
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
          title: OTHER_FILER_TYPES[2],
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [...MOCK_CASE.petitioners, ...mockOtherFilers],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );

      const errors = myCase.getFormattedValidationErrors();

      expect(errors).toMatchObject({
        'petitioners[2]': '"petitioners[2]" contains a duplicate value',
      });
    });

    it('fails validation with an invalid otherFilerType', () => {
      const mockOtherFilers = [
        {
          address1: '42 Lamb Sauce Blvd',
          city: 'Nashville',
          contactType: CONTACT_TYPES.otherFiler,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'gordon@example.com',
          name: 'Gordon Ramsay',
          otherFilerType: null,
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
          title: UNIQUE_OTHER_FILER_TYPE,
        },
        {
          address1: '1337 12th Ave',
          city: 'Flavortown',
          contactType: CONTACT_TYPES.otherFiler,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'mayor@example.com',
          name: 'Guy Fieri',
          otherFilerType: UNIQUE_OTHER_FILER_TYPE,
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
          title: UNIQUE_OTHER_FILER_TYPE,
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [...MOCK_CASE.petitioners, ...mockOtherFilers],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );

      const errors = myCase.getFormattedValidationErrors();
      expect(errors.petitioners).toMatchObject([
        {
          index: 1,
          otherFilerType: 'Select a filer type',
        },
      ]);
    });
  });

  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
      expect(myCase.entityName).toEqual('Case');
    });

    it('creates a valid case without a petition docket entry and does not throw an error', () => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitionsClerk,
      });
      const myCase = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [MOCK_CASE.docketEntries[1]],
        },
        {
          applicationContext,
          filtered: true,
        },
      );

      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates a valid case from an already existing case json', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates a valid case from an already existing case json when the docketNumber has leading zeroes', () => {
      const myCase = new Case(
        { ...MOCK_CASE, docketNumber: '00101-20' },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
      expect(myCase.docketNumber).toBe('101-20');
    });

    it('Creates an invalid case if set as calendared but no trialSessionId is provided', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.calendared,
          trialSessionId: undefined,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
      expect(myCase.getFormattedValidationErrors()).toMatchObject({
        trialSessionId: '"trialSessionId" is required',
      });
    });

    it('Creates an invalid case with an invalid nested contact object', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [{}],
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with a docket entry', () => {
      const myCase = new Case(
        {
          docketEntries: [
            {
              docketEntryId: '123',
              documentType: 'testing',
            },
          ],
          petitioners: [{ name: 'Test Petitioner' }],
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no docket entries', () => {
      const myCase = new Case(
        {
          docketEntries: [],
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with empty object', () => {
      const myCase = new Case(
        {},
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no petitioners', () => {
      const myCase = new Case(
        {
          petitioners: [],
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with invalid other petitioner', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [
            {
              address1: '982 Oak Boulevard',
              address2: 'Maxime dolorum quae ',
              address3: 'Ut numquam ducimus ',
              city: 'Placeat sed dolorum',
              contactType: CONTACT_TYPES.otherPetitioner,
              countryType: COUNTRY_TYPES.DOMESTIC,
              phone: '+1 (785) 771-2329',
              postalCode: '17860',
              secondaryName: 'Logan Fields',
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
              state: 'LA',
            },
          ],
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates a valid case with statistics', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          statistics: [
            {
              irsDeficiencyAmount: 1,
              irsTotalPenalties: 1,
              year: '2001',
              yearOrPeriod: 'Year',
            },
          ],
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates an invalid case with an invalid trial time', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          trialTime: '91:30',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with blocked set to true but no blockedReason or blockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with blocked set to true and a blockedDate but no blockedReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-03-01T21:42:29.073Z',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with blocked set to true and an invalid blockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: 'undefined-undefined-undefined',
          blockedReason: 'something',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates a valid case with blocked set to false but no blockedReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: false,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates a valid case with blocked set to true and a blockedReason and blockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-03-01T21:42:29.073Z',
          blockedReason: 'something',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates a valid case with a trial time', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          trialTime: '9:30',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates a valid case with automaticBlocked set to true and a valid automaticBlockedReason and automaticBlockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          automaticBlocked: true,
          automaticBlockedDate: '2019-03-01T21:42:29.073Z',
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates a valid case with automaticBlocked set to true and an invalid automaticBlockedReason and automaticBlockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          automaticBlocked: true,
          automaticBlockedDate: '2019-03-01T21:42:29.073Z',
          automaticBlockedReason: 'Some Other Reason Not Valid',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with highPriority set to true but no highPriorityReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates a valid case with highPriority set to true and a highPriorityReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
          highPriorityReason: 'something',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates an invalid case with closed status and no closed date', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.closed,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.isValid()).toBeFalsy();
      expect(myCase.getFormattedValidationErrors()).toMatchObject({
        closedDate: expect.anything(),
      });
    });

    it('Creates a valid case with closed status and a closed date', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          closedDate: '2019-03-01T21:40:46.415Z',
          status: CASE_STATUS_TYPES.closed,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('Creates a valid case with sealedDate set to a valid date', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          sealedDate: '2019-09-19T16:42:00.000Z',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    describe('with different payment statuses', () => {
      it('requires payment date and method if petition fee status is paid', () => {
        const myCase = new Case(
          {
            ...MOCK_CASE,
            petitionPaymentStatus: PAYMENT_STATUS.PAID,
          },
          {
            applicationContext,
          },
        );

        expect(myCase.getFormattedValidationErrors()).toMatchObject({
          petitionPaymentDate: expect.anything(),
          petitionPaymentMethod: expect.anything(),
        });
      });

      it('requires waived date to be specified if petition fee is waived', () => {
        const myCase = new Case(
          {
            ...MOCK_CASE,
            petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          },
          {
            applicationContext,
          },
        );

        expect(myCase.getFormattedValidationErrors()).toMatchObject({
          petitionPaymentWaivedDate: expect.anything(),
        });
      });
    });

    it('fails validation if a petition fee payment date is in the future', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitionPaymentDate: '2050-10-01T21:40:46.415Z',
          petitionPaymentMethod: 'Magic Beans',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toMatchObject({
        petitionPaymentDate: expect.anything(),
      });
    });

    it('fails validation if a petition fee waived date is in the future', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          petitionPaymentWaivedDate: '2050-10-01T21:40:46.415Z',
        },
        {
          applicationContext,
        },
      );

      expect(myCase.getFormattedValidationErrors()).toMatchObject({
        petitionPaymentWaivedDate: expect.anything(),
      });
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;

      try {
        new Case(MOCK_CASE, {
          applicationContext,
        }).validate();
      } catch (err) {
        error = err;
      }

      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid cases', () => {
      let error;
      try {
        new Case(
          {},
          {
            applicationContext,
          },
        ).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });

    it('should throw an error on a case that is missing contacts', () => {
      const testCase = new Case(
        {
          ...MOCK_CASE,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitioners: [],
        },
        {
          applicationContext,
        },
      );

      const errors = testCase.getFormattedValidationErrors();

      expect(errors).toMatchObject({
        petitioners: [
          {
            address1: 'Enter mailing address',
            city: 'Enter city',
            countryType: 'Enter country type',
            index: 0,
            name: ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.name,
            phone: 'Enter phone number',
            postalCode: 'Enter ZIP code',
            state: 'Enter state',
          },
          {
            address1: 'Enter mailing address',
            city: 'Enter city',
            countryType: 'Enter country type',
            index: 1,
            name: ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.name,
            phone: 'Enter phone number',
            postalCode: 'Enter ZIP code',
            state: 'Enter state',
          },
        ],
      });
    });

    it('should throw an error on a case that is missing a primary contact', () => {
      const testCase = new Case(
        {
          ...MOCK_CASE,
          partyType: PARTY_TYPES.petitioner,
          petitioners: [],
        },
        {
          applicationContext,
        },
      );

      const errors = testCase.getFormattedValidationErrors();

      expect(errors).toMatchObject({
        petitioners: [
          {
            address1: 'Enter mailing address',
            city: 'Enter city',
            countryType: 'Enter country type',
            index: 0,
            name: ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.name,
            phone: 'Enter phone number',
            postalCode: 'Enter ZIP code',
            state: 'Enter state',
          },
        ],
      });
    });
  });

  describe('getPetitionDocketEntry', () => {
    it('should get the petition docket entry by documentType', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      const result = myCase.getPetitionDocketEntry();
      expect(result.documentType).toEqual(
        INITIAL_DOCUMENT_TYPES.petition.documentType,
      );
    });

    it('should get the petition docket entry from a raw case', () => {
      const result = getPetitionDocketEntry(MOCK_CASE);
      expect(result.documentType).toEqual(
        INITIAL_DOCUMENT_TYPES.petition.documentType,
      );
    });

    it('should not throw an error when raw case does not have docketEntries', () => {
      expect(() =>
        getPetitionDocketEntry({ ...MOCK_CASE, docketEntries: undefined }),
      ).not.toThrow();
    });
  });

  describe('getIrsSendDate', () => {
    it('should get the IRS send date from the petition docket entry', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [
            { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
          ],
        },
        {
          applicationContext,
        },
      );
      const result = myCase.getIrsSendDate();
      expect(result).toEqual('2019-03-01T21:40:46.415Z');
    });

    it('should return undefined for irsSendDate if the petition docket entry is not served', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [{ documentType: 'Petition' }],
        },
        {
          applicationContext,
        },
      );
      const result = myCase.getIrsSendDate();
      expect(result).toBeUndefined();
    });

    it('should return undefined for irsSendDate if the petition docket entry is not found', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [
            { documentType: 'Answer', servedAt: '2019-03-01T21:40:46.415Z' },
          ],
        },
        {
          applicationContext,
        },
      );
      const result = myCase.getIrsSendDate();
      expect(result).toBeUndefined();
    });
  });

  describe('updateDocketEntry', () => {
    it('should replace the docket entry with the exact object provided', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });

      myCase.updateDocketEntry({
        docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      });

      expect(
        myCase.docketEntries.find(
          d => d.docketEntryId === MOCK_DOCUMENTS[0].docketEntryId,
        ),
      ).toEqual({
        docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      });
    });

    it('should not change any docketEntries if no match is found', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });

      myCase.updateDocketEntry({
        docketEntryId: '11001001',
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      });

      expect(myCase.docketEntries).toMatchObject(MOCK_DOCUMENTS);
    });
  });

  describe('updateCorrespondence', () => {
    it('should update a correspondence document', () => {
      const mockCorrespondence = new Correspondence({
        correspondenceId: '123-abc',
        documentTitle: 'My Correspondence',
        filedBy: 'Docket clerk',
      });
      const myCase = new Case(
        { ...MOCK_CASE, correspondence: [mockCorrespondence] },
        {
          applicationContext,
        },
      );

      myCase.updateCorrespondence({
        correspondenceId: mockCorrespondence.correspondenceId,
        documentTitle: 'updated title',
      });

      expect(
        myCase.correspondence.find(
          d => d.correspondenceId === mockCorrespondence.correspondenceId,
        ).documentTitle,
      ).toEqual('updated title');
    });

    it('should not throw an exception when the specified correspondence document is not found', () => {
      const mockCorrespondence = new Correspondence({
        correspondenceId: '123-abc',
        documentTitle: 'My Correspondence',
        filedBy: 'Docket clerk',
      });
      const myCase = new Case(
        { ...MOCK_CASE, correspondence: [mockCorrespondence] },
        {
          applicationContext,
        },
      );

      myCase.updateCorrespondence({
        correspondenceId: 'BAD-ID',
        documentTitle: 'updated title',
      });

      expect(
        myCase.correspondence.find(
          d => d.correspondenceId === mockCorrespondence.correspondenceId,
        ).documentTitle,
      ).toEqual('My Correspondence');
    });
  });

  describe('updatePrivatePractitioner', () => {
    it('updates the given practitioner on the case', () => {
      const caseToVerify = new Case(
        {
          privatePractitioners: [
            new PrivatePractitioner({
              representing: ['182e1a2c-0252-4d76-8590-593324efaee3'],
              userId: 'privatePractitioner',
            }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.privatePractitioners).not.toBeNull();
      expect(caseToVerify.privatePractitioners[0].representing).toEqual([
        '182e1a2c-0252-4d76-8590-593324efaee3',
      ]);

      caseToVerify.updatePrivatePractitioner({
        representing: [],
        userId: 'privatePractitioner',
      });
      expect(caseToVerify.privatePractitioners[0].representing).toEqual([]);
    });
  });

  describe('removePrivatePractitioner', () => {
    it('does not remove a practitioner if not found in the associated case privatePractioners array', () => {
      const caseToVerify = new Case(
        {
          privatePractitioners: [
            new PrivatePractitioner({ userId: 'privatePractitioner1' }),
            new PrivatePractitioner({ userId: 'privatePractitioner2' }),
            new PrivatePractitioner({ userId: 'privatePractitioner3' }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.privatePractitioners.length).toEqual(3);

      caseToVerify.removePrivatePractitioner({
        userId: 'privatePractitioner99',
      });
      expect(caseToVerify.privatePractitioners.length).toEqual(3);
    });
    it('removes the user from associated case privatePractitioners array', () => {
      const caseToVerify = new Case(
        {
          privatePractitioners: [
            new PrivatePractitioner({ userId: 'privatePractitioner1' }),
            new PrivatePractitioner({ userId: 'privatePractitioner2' }),
            new PrivatePractitioner({ userId: 'privatePractitioner3' }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.privatePractitioners).not.toBeNull();
      expect(caseToVerify.privatePractitioners.length).toEqual(3);

      caseToVerify.removePrivatePractitioner({
        userId: 'privatePractitioner2',
      });
      expect(caseToVerify.privatePractitioners.length).toEqual(2);
      expect(
        caseToVerify.privatePractitioners.find(
          practitioner => practitioner.userId === 'privatePractitioner2',
        ),
      ).toBeFalsy();
    });
  });

  describe('updateIrsPractitioner', () => {
    it('updates the given irsPractitioner on the case', () => {
      const caseToVerify = new Case(
        {
          irsPractitioners: [
            new IrsPractitioner({
              email: 'irsPractitioner@example.com',
              userId: 'irsPractitioner',
            }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.irsPractitioners).not.toBeNull();
      expect(caseToVerify.irsPractitioners[0].email).toEqual(
        'irsPractitioner@example.com',
      );

      caseToVerify.updateIrsPractitioner({
        email: 'irsPractitioner@example.com',
        userId: 'irsPractitioner',
      });
      expect(caseToVerify.irsPractitioners[0].email).toEqual(
        'irsPractitioner@example.com',
      );
    });
  });

  describe('removeIrsPractitioner', () => {
    it('does not remove a practitioner if not found in irsPractitioners array', () => {
      const caseToVerify = new Case(
        {
          irsPractitioners: [
            new IrsPractitioner({ userId: 'irsPractitioner1' }),
            new IrsPractitioner({ userId: 'irsPractitioner2' }),
            new IrsPractitioner({ userId: 'irsPractitioner3' }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.irsPractitioners.length).toEqual(3);

      caseToVerify.removeIrsPractitioner({ userId: 'irsPractitioner99' });
      expect(caseToVerify.irsPractitioners.length).toEqual(3);
    });

    it('removes the user from associated case irsPractitioners array', () => {
      const caseToVerify = new Case(
        {
          irsPractitioners: [
            new IrsPractitioner({ userId: 'irsPractitioner1' }),
            new IrsPractitioner({ userId: 'irsPractitioner2' }),
            new IrsPractitioner({ userId: 'irsPractitioner3' }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.irsPractitioners).not.toBeNull();
      expect(caseToVerify.irsPractitioners.length).toEqual(3);

      caseToVerify.removeIrsPractitioner({ userId: 'irsPractitioner2' });
      expect(caseToVerify.irsPractitioners.length).toEqual(2);
      expect(
        caseToVerify.irsPractitioners.find(
          practitioner => practitioner.userId === 'irsPractitioner2',
        ),
      ).toBeFalsy();
    });
  });

  describe('setAsBlocked', () => {
    it('sets the case as blocked with a blocked reason', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.blocked).toBeFalsy();

      caseToUpdate.setAsBlocked('because reasons');

      expect(caseToUpdate.blocked).toEqual(true);
      expect(caseToUpdate.blockedReason).toEqual('because reasons');
      expect(caseToUpdate.blockedDate).toBeDefined();
    });
  });

  describe('unsetAsBlocked', () => {
    it('unsets the case as blocked', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedReason: 'because reasons',
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.blocked).toBeTruthy();

      caseToUpdate.unsetAsBlocked();

      expect(caseToUpdate.blocked).toBeFalsy();
      expect(caseToUpdate.blockedReason).toBeUndefined();
      expect(caseToUpdate.blockedDate).toBeUndefined();
    });
  });

  describe('updateAutomaticBlocked', () => {
    it('sets the case as automaticBlocked with a valid blocked reason', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.automaticBlocked).toBeFalsy();

      caseToUpdate.updateAutomaticBlocked({});

      expect(caseToUpdate.automaticBlocked).toEqual(true);
      expect(caseToUpdate.automaticBlockedReason).toEqual(
        AUTOMATIC_BLOCKED_REASONS.pending,
      );
      expect(caseToUpdate.automaticBlockedDate).toBeDefined();
      expect(caseToUpdate.isValid()).toBeTruthy();
    });
  });

  describe('unupdateAutomaticBlocked', () => {
    it('unsets the case as automatic blocked', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE_WITHOUT_PENDING,
          automaticBlocked: true,
          automaticBlockedReason: 'because reasons',
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.automaticBlocked).toBeTruthy();

      caseToUpdate.updateAutomaticBlocked({});

      expect(caseToUpdate.automaticBlocked).toBeFalsy();
      expect(caseToUpdate.automaticBlockedReason).toBeUndefined();
      expect(caseToUpdate.automaticBlockedDate).toBeUndefined();
    });
  });

  describe('setAsHighPriority', () => {
    it('sets the case as high priority with a high priority reason', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.highPriority).toBeFalsy();

      caseToUpdate.setAsHighPriority('because reasons');

      expect(caseToUpdate.highPriority).toEqual(true);
      expect(caseToUpdate.highPriorityReason).toEqual('because reasons');
    });
  });

  describe('unsetAsHighPriority', () => {
    it('unsets the case as high priority', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
          highPriorityReason: 'because reasons',
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.highPriority).toBeTruthy();

      caseToUpdate.unsetAsHighPriority();

      expect(caseToUpdate.highPriority).toBeFalsy();
      expect(caseToUpdate.highPriorityReason).toBeUndefined();
    });
  });

  describe('removeFromTrial', () => {
    it('removes the case from trial, unsetting trial details and setting status to general docket ready for trial', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, Alabama',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrial();

      expect(caseToUpdate.status).toEqual(
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );
      expect(caseToUpdate.trialDate).toBeFalsy();
      expect(caseToUpdate.associatedJudge).toEqual(CHIEF_JUDGE);
      expect(caseToUpdate.trialLocation).toBeFalsy();
      expect(caseToUpdate.trialSessionId).toBeFalsy();
      expect(caseToUpdate.trialTime).toBeFalsy();
    });

    it('sets the case status to the given case status when provided', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, Alabama',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrial(CASE_STATUS_TYPES.cav);

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.cav);
      expect(caseToUpdate.associatedJudge).toEqual('Chief Judge');
    });

    it('sets the case status along with the associated judge when provided', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, Alabama',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrial(CASE_STATUS_TYPES.cav, 'Judge Dredd');

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.cav);
      expect(caseToUpdate.associatedJudge).toEqual('Judge Dredd');
    });
  });

  describe('removeFromTrialWithAssociatedJudge', () => {
    it('removes the case from trial, updating the associated judge if one is passed in', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, Alabama',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrialWithAssociatedJudge('Judge Colvin');

      expect(caseToUpdate.associatedJudge).toEqual('Judge Colvin');
      expect(caseToUpdate.trialDate).toBeFalsy();
      expect(caseToUpdate.trialLocation).toBeFalsy();
      expect(caseToUpdate.trialSessionId).toBeFalsy();
      expect(caseToUpdate.trialTime).toBeFalsy();
    });

    it('removes the case from trial, leaving the associated judge unchanged if one is not passed in', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, Alabama',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrialWithAssociatedJudge();

      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialDate).toBeFalsy();
      expect(caseToUpdate.trialLocation).toBeFalsy();
      expect(caseToUpdate.trialSessionId).toBeFalsy();
      expect(caseToUpdate.trialTime).toBeFalsy();
    });
  });

  describe('hasPendingItems', () => {
    it('should not show the case as having pending items if no docketEntries are pending', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE_WITHOUT_PENDING,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.hasPendingItems).toEqual(false);
      expect(caseToUpdate.doesHavePendingItems()).toEqual(false);
    });

    it('should not show the case as having pending items if some docketEntries are pending and not served', () => {
      const mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            pending: true,
            servedAt: undefined,
          },
        ],
      };

      const caseToUpdate = new Case(mockCase, {
        applicationContext,
      });

      expect(caseToUpdate.hasPendingItems).toEqual(false);
      expect(caseToUpdate.doesHavePendingItems()).toEqual(false);
    });

    it('should show the case as having pending items if some docketEntries are pending and served', () => {
      const mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            pending: true,
            servedAt: '2019-08-25T05:00:00.000Z',
            servedParties: [{ name: 'Bob' }],
          },
        ],
      };

      const caseToUpdate = new Case(mockCase, {
        applicationContext,
      });

      expect(caseToUpdate.hasPendingItems).toEqual(true);
      expect(caseToUpdate.doesHavePendingItems()).toEqual(true);
    });

    it('should show the case as having pending items if isLegacyServed is true', () => {
      const mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            isLegacyServed: true,
            pending: true,
            servedAt: undefined,
            servedParties: undefined,
          },
        ],
      };

      const caseToUpdate = new Case(mockCase, {
        applicationContext,
      });

      expect(caseToUpdate.hasPendingItems).toEqual(true);
      expect(caseToUpdate.doesHavePendingItems()).toEqual(true);
    });
  });

  describe('setCaseStatus', () => {
    it('should update the case status and set the associated judge to the chief judge if the new status is General Docket - Not At Issue', () => {
      const updatedCase = new Case(
        {
          ...MOCK_CASE,
          associatedJudge: 'Judge Buch',
        },
        {
          applicationContext,
        },
      );

      updatedCase.setCaseStatus(CASE_STATUS_TYPES.generalDocket);

      expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.generalDocket);
      expect(updatedCase.associatedJudge).toEqual(CHIEF_JUDGE);
    });

    it('should update the case status, leave the associated judge unchanged, and call closeCase if the new status is Closed', () => {
      const closeCaseSpy = jest.spyOn(Case.prototype, 'closeCase');

      const updatedCase = new Case(
        {
          ...MOCK_CASE,
          associatedJudge: 'Judge Buch',
        },
        {
          applicationContext,
        },
      );

      updatedCase.setCaseStatus(CASE_STATUS_TYPES.closed);

      expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
      expect(updatedCase.associatedJudge).toEqual('Judge Buch');
      expect(closeCaseSpy).toBeCalled();
      closeCaseSpy.mockRestore();
    });
  });

  describe('setCaseCaption', () => {
    it('should set the case caption and update the case title', () => {
      const updatedCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      updatedCase.setCaseCaption('A whole new caption');

      expect(updatedCase.caseCaption).toEqual('A whole new caption');
    });
  });

  describe('Case Consolidation Eligibility', () => {
    describe('canConsolidate', () => {
      let caseEntity;

      beforeEach(() => {
        caseEntity = new Case(
          { ...MOCK_CASE, status: CASE_STATUS_TYPES.submitted },
          {
            applicationContext,
          },
        );
      });

      it('should fail when the pending case status is ineligible', () => {
        caseEntity.status = CASE_STATUS_TYPES.new;
        const result = caseEntity.canConsolidate();

        expect(result).toEqual(false);
      });

      it('should pass when a case has an eligible case status', () => {
        const result = caseEntity.canConsolidate();

        expect(result).toEqual(true);
      });

      it('should accept a case for consolidation as a param to check its eligible case status', () => {
        let result;

        // verify a failure on the current (this) case
        caseEntity.status = CASE_STATUS_TYPES.new;
        result = caseEntity.canConsolidate();
        expect(result).toEqual(false);

        // should also fail because duplicate of (this) case
        const otherCase = { ...caseEntity };
        result = caseEntity.canConsolidate(otherCase);
        expect(result).toEqual(false);

        otherCase.status = CASE_STATUS_TYPES.submitted;
        result = caseEntity.canConsolidate(otherCase);
        expect(result).toEqual(true);
      });
    });

    describe('getConsolidationStatus', () => {
      let leadCaseEntity;
      let pendingCaseEntity;

      beforeEach(() => {
        leadCaseEntity = new Case(
          {
            ...MOCK_CASE,
            procedureType: 'Regular',
            status: CASE_STATUS_TYPES.submitted,
          },
          { applicationContext },
        );

        pendingCaseEntity = new Case(
          {
            ...MOCK_CASE,
            docketNumber: '102-19',
            procedureType: 'Regular',
            status: CASE_STATUS_TYPES.submitted,
          },
          { applicationContext },
        );
      });

      it('should fail when case statuses are not the same', () => {
        pendingCaseEntity.status = CASE_STATUS_TYPES.calendared;

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual(['Case status is not the same']);
      });

      it('should fail when cases are the same', () => {
        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: leadCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual(['Cases are the same']);
      });

      it('should fail when case procedures are not the same', () => {
        pendingCaseEntity.procedureType = 'small';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual(['Case procedure is not the same']);
      });

      it('should fail when case requested place of trials are not the same', () => {
        pendingCaseEntity.preferredTrialCity = 'Flavortown, AR';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual(['Place of trial is not the same']);
      });

      it('should fail when case judges are not the same', () => {
        pendingCaseEntity.associatedJudge = 'Some judge';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual(['Judge is not the same']);
      });

      it('should fail when case statuses are both ineligible', () => {
        leadCaseEntity.status = CASE_STATUS_TYPES.closed;
        pendingCaseEntity.status = CASE_STATUS_TYPES.closed;

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual([
          'Case status is Closed and cannot be consolidated',
        ]);
      });

      it('should only return the ineligible failure if the pending case status is ineligible', () => {
        leadCaseEntity.status = CASE_STATUS_TYPES.submitted;
        pendingCaseEntity.status = CASE_STATUS_TYPES.closed;
        pendingCaseEntity.procedureType = 'small';
        pendingCaseEntity.trialLocation = 'Flavortown, AR';
        pendingCaseEntity.associatedJudge = 'Some judge';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual([
          'Case status is Closed and cannot be consolidated',
        ]);
      });

      it('should return all reasons for the failure if the case status is eligible', () => {
        pendingCaseEntity.procedureType = 'small';
        pendingCaseEntity.preferredTrialCity = 'Flavortown, AR';
        pendingCaseEntity.associatedJudge = 'Some judge';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual([
          'Case procedure is not the same',
          'Place of trial is not the same',
          'Judge is not the same',
        ]);
      });

      it('should pass when both cases are eligible for consolidation', () => {
        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
        });

        expect(result.canConsolidate).toEqual(true);
        expect(result.reason).toEqual([]);
      });
    });

    describe('removeConsolidation', () => {
      it('Should unset the leadDocketNumber on the given case', async () => {
        const caseEntity = new Case(
          {
            ...MOCK_CASE,
            leadDocketNumber: '101-20',
            preferredTrialCity: 'Birmingham, Alabama',
            procedureType: 'Regular',
            status: CASE_STATUS_TYPES.submitted,
          },
          { applicationContext },
        );
        const result = caseEntity.removeConsolidation();

        expect(result.leadDocketNumber).toBeUndefined();
      });
    });
  });

  describe('trialDate and trialSessionId validation', () => {
    it('should fail validation when trialSessionId is defined and trialDate is undefined', () => {
      let blockedCalendaredCase = {
        ...MOCK_CASE,
        trialSessionId: '0762e545-8cbc-4a18-ab7a-27d205c83f60',
      };
      const myCase = new Case(blockedCalendaredCase, { applicationContext });
      expect(myCase.getFormattedValidationErrors()).toEqual({
        trialDate: '"trialDate" is required',
      });
    });

    it('should fail validation when case status is calendared, trialDate is defined and trialSessionId is undefined', () => {
      let blockedCalendaredCase = {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:40:46.415Z',
      };
      const myCase = new Case(blockedCalendaredCase, { applicationContext });
      expect(myCase.getFormattedValidationErrors()).toEqual({
        trialSessionId: '"trialSessionId" is required',
      });
    });

    it('should pass validation when case status is not calendared, trialDate is undefined and trialSessionId is undefined', () => {
      let blockedCalendaredCase = {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
        trialDate: undefined,
        trialSessionId: undefined,
      };
      const myCase = new Case(blockedCalendaredCase, { applicationContext });
      expect(myCase.getFormattedValidationErrors()).toBe(null);
    });

    it('should pass validation when case status is calendared, trialDate is defined and trialSessionId is defined', () => {
      let blockedCalendaredCase = {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:40:46.415Z',
        trialSessionId: '0762e545-8cbc-4a18-ab7a-27d205c83f60',
      };
      const myCase = new Case(blockedCalendaredCase, { applicationContext });
      expect(myCase.getFormattedValidationErrors()).toBe(null);
    });
  });

  it('required messages display for non-defaulted fields when an empty case is validated', () => {
    const myCase = new Case(
      {},
      {
        applicationContext,
      },
    );

    expect(myCase.getFormattedValidationErrors()).toEqual({
      caseCaption: 'Enter a case caption',
      caseType: 'Select a case type',
      docketNumber: 'Docket number is required',
      partyType: 'Select a party type',
      procedureType: 'Select a case procedure',
      sortableDocketNumber: 'Sortable docket number is required',
    });
  });

  describe('Statistics', () => {
    it('should be required for deficiency cases when hasVerifiedIrsNotice is true', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      );
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics: [],
        },
        {
          applicationContext,
        },
      );

      expect(caseEntity.getFormattedValidationErrors()).toEqual({
        statistics: '"statistics" must contain at least 1 items',
      });
    });

    it('should not be required for deficiency cases when hasVerifiedIrsNotice is false', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      );
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: false,
        },
        {
          applicationContext,
        },
      );

      expect(caseEntity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be required for other cases', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      );
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.other,
          hasVerifiedIrsNotice: true,
        },
        {
          applicationContext,
        },
      );

      expect(caseEntity.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('statistics', () => {
    it('should successfully add a statistic', () => {
      const caseEntity = new Case(MOCK_CASE, { applicationContext });

      const statisticToAdd = new Statistic(
        {
          determinationDeficiencyAmount: 567,
          determinationTotalPenalties: 789,
          irsDeficiencyAmount: 11.2,
          irsTotalPenalties: 66.87,
          year: 2012,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      caseEntity.addStatistic(statisticToAdd);

      expect(caseEntity.statistics.length).toEqual(1);
    });

    it('should throw an error if the max number of statistics for a case has already been reached', () => {
      const statisticsWithMaxLength = new Array(12); // 12 is the maximum number of statistics
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          statistics: statisticsWithMaxLength,
        },
        { applicationContext },
      );

      const statisticToAdd = new Statistic(
        {
          determinationDeficiencyAmount: 567,
          determinationTotalPenalties: 789,
          irsDeficiencyAmount: 11.2,
          irsTotalPenalties: 66.87,
          year: 2012,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      let error;
      try {
        caseEntity.addStatistic(statisticToAdd);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.toString()).toEqual(
        'Error: maximum number of statistics reached',
      );
      expect(caseEntity.statistics.length).toEqual(12);
    });

    it('should successfully update a statistic', () => {
      const statisticId = '2db9f2b6-d65b-4f71-8ddc-c218d0787e15';

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          statistics: [
            {
              determinationDeficiencyAmount: 567,
              determinationTotalPenalties: 789,
              irsDeficiencyAmount: 11.2,
              irsTotalPenalties: 66.87,
              statisticId,
              year: 2012,
              yearOrPeriod: 'Year',
            },
          ],
        },
        { applicationContext },
      );

      const statisticToUpdate = new Statistic(
        {
          determinationDeficiencyAmount: 1,
          determinationTotalPenalties: 1,
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          statisticId,
          year: 2012,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      caseEntity.updateStatistic(statisticToUpdate, statisticId);

      expect(caseEntity.statistics.length).toEqual(1);
      expect(caseEntity.statistics[0]).toEqual(statisticToUpdate);
    });

    it('should not update a statistic if its id is not present on the case', () => {
      const originalStatistic = {
        determinationDeficiencyAmount: 567,
        determinationTotalPenalties: 789,
        irsDeficiencyAmount: 11.2,
        irsTotalPenalties: 66.87,
        statisticId: '2db9f2b6-d65b-4f71-8ddc-c218d0787e15',
        year: 2012,
        yearOrPeriod: 'Year',
      };

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          statistics: [originalStatistic],
        },
        { applicationContext },
      );

      const statisticToUpdate = new Statistic(
        {
          determinationDeficiencyAmount: 1,
          determinationTotalPenalties: 1,
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          statisticId: '9f23dac6-4a9d-4e66-aafc-b6d3c892d907',
          year: 2012,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      caseEntity.updateStatistic(
        statisticToUpdate,
        '9f23dac6-4a9d-4e66-aafc-b6d3c892d907',
      );

      expect(caseEntity.statistics.length).toEqual(1);
      expect(caseEntity.statistics[0]).toMatchObject(originalStatistic);
    });

    it('should successfully delete a statistic', () => {
      const statistic0Id = 'cc0f6102-3537-4047-b951-74c21b1aab76';
      const statistic1Id = 'f4c00a75-f6d9-4e63-9cc7-ca1deee8a949';
      const originalStatistics = [
        {
          determinationDeficiencyAmount: 1,
          determinationTotalPenalties: 1,
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          statisticId: statistic0Id,
          year: 2012,
          yearOrPeriod: 'Year',
        },
        {
          determinationDeficiencyAmount: 2,
          determinationTotalPenalties: 2,
          irsDeficiencyAmount: 2,
          irsTotalPenalties: 2,
          statisticId: statistic1Id,
          year: 2013,
          yearOrPeriod: 'Year',
        },
      ];

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          statistics: originalStatistics,
        },
        { applicationContext },
      );

      caseEntity.deleteStatistic(statistic0Id);

      expect(caseEntity.statistics.length).toEqual(1);
      expect(caseEntity.statistics[0].statisticId).toEqual(statistic1Id);
    });

    it('should not delete a statistic if its statisticId is not present on the case', () => {
      const statistic0Id = 'cc0f6102-3537-4047-b951-74c21b1aab76';
      const statistic1Id = 'f4c00a75-f6d9-4e63-9cc7-ca1deee8a949';
      const originalStatistics = [
        {
          determinationDeficiencyAmount: 1,
          determinationTotalPenalties: 1,
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          statisticId: statistic0Id,
          year: 2012,
          yearOrPeriod: 'Year',
        },
        {
          determinationDeficiencyAmount: 2,
          determinationTotalPenalties: 2,
          irsDeficiencyAmount: 2,
          irsTotalPenalties: 2,
          statisticId: statistic1Id,
          year: 2013,
          yearOrPeriod: 'Year',
        },
      ];

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          statistics: originalStatistics,
        },
        { applicationContext },
      );

      caseEntity.deleteStatistic('16fc02bc-f00a-453c-a19c-e5597a8850ba');

      expect(caseEntity.statistics.length).toEqual(2);
    });
  });

  describe('secondary contact', () => {
    it('does not create a secondary contact when one is not needed by the party type', () => {
      const myCase = new Case({ ...MOCK_CASE }, { applicationContext });

      expect(myCase.getContactSecondary()).toBeUndefined();
    });

    it('should require a secondary contact when partyType is petitionerSpouse', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        { applicationContext },
      );

      expect(myCase.getFormattedValidationErrors()).toMatchObject({
        petitioners: [
          {
            index: 1,
          },
        ],
      });
    });

    it('should require a valid secondary contact when partyType is petitionerSpouse', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitioners: [
            ...MOCK_CASE.petitioners,
            {
              address2: undefined,
              address3: undefined,
              contactId: '56387318-0092-49a3-8cc1-921b0432bd16',
              contactType: CONTACT_TYPES.secondary,
              countryType: COUNTRY_TYPES.DOMESTIC,
            },
          ],
        },
        { applicationContext },
      );

      expect(myCase.getFormattedValidationErrors()).toMatchObject({
        petitioners: [
          {
            index: 1,
          },
        ],
      });
      expect(myCase.isValid()).toBeFalsy();
    });
  });

  describe('judgeUserId', () => {
    it('sets the judgeUserId property when a value is passed in', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';

      const myCase = new Case(
        { ...MOCK_CASE, judgeUserId: mockJudgeUserId },
        { applicationContext },
      );

      expect(myCase).toMatchObject({
        judgeUserId: mockJudgeUserId,
      });
      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });

    it('does not fail validation without a judgeUserId', () => {
      const myCase = new Case(MOCK_CASE, { applicationContext });

      expect(myCase.judgeUserId).toBeUndefined();
      expect(myCase.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('blocked status validation for calendared cases', () => {
    const mockTrialSessionId = '9e29b116-58a0-40f5-afe6-e3a0ba4f226a';

    it('fails validation when the case status is calendared and blocked is true', () => {
      const blockedCalendaredCase = {
        ...MOCK_CASE,
        blocked: true,
        blockedDate: '2019-03-01T21:42:29.073Z',
        blockedReason: 'A reason',
        status: CASE_STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:42:29.073Z',
        trialSessionId: mockTrialSessionId,
      };

      const myCase = new Case(blockedCalendaredCase, { applicationContext });

      expect(myCase.getFormattedValidationErrors()).toEqual({
        blocked: '"blocked" contains an invalid value',
      });
    });

    it('passes validation when the case status is calendared and blocked is false', () => {
      const calendaredCase = {
        ...MOCK_CASE,
        blocked: false,
        status: CASE_STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:42:29.073Z',
        trialSessionId: mockTrialSessionId,
      };

      const myCase = new Case(calendaredCase, { applicationContext });

      expect(myCase.getFormattedValidationErrors()).toBe(null);
    });

    it('passes validation when the case status is not calendared and blocked is true', () => {
      const blockedReadyForTrialCase = {
        ...MOCK_CASE,
        blocked: true,
        blockedDate: '2019-03-01T21:42:29.073Z',
        blockedReason: 'A reason',
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        trialDate: '2019-03-01T21:42:29.073Z',
        trialSessionId: mockTrialSessionId,
      };

      const myCase = new Case(blockedReadyForTrialCase, {
        applicationContext,
      });

      expect(myCase.getFormattedValidationErrors()).toBe(null);
    });
  });
});

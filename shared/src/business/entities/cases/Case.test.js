const {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_CUTOFF_UNIT,
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
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
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  Case,
  caseHasServedDocketEntries,
  getContactPrimary,
  isAssociatedUser,
  isSealedCase,
} = require('./Case');
const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const { ContactFactory } = require('../contacts/ContactFactory');
const { Correspondence } = require('../Correspondence');
const { IrsPractitioner } = require('../IrsPractitioner');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { prepareDateFromString } = require('../../utilities/DateHandler');
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

  describe('updatePetitioner', () => {
    it('should throw an error when the petitioner to update is not found on the case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        { applicationContext },
      );

      expect(() => myCase.updatePetitioner({ contactId: 'badId' })).toThrow(
        'Petitioner was not found',
      );
    });

    it('should update the petitioner when found on case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        { applicationContext },
      );

      myCase.updatePetitioner({
        contactId: myCase.petitioners[0].contactId,
        contactType: CONTACT_TYPES.primary,
        name: undefined,
      });

      const updatedCaseRaw = myCase.validate().toRawObject();

      // send back through the constructor so contacts are recreated as entities
      const updatedCaseEntity = new Case(updatedCaseRaw, {
        applicationContext,
      });

      expect(updatedCaseEntity.petitioners[0]).toMatchObject({
        name: undefined,
      });
      expect(updatedCaseEntity.isValid()).toBeFalsy();
    });

    it('should fail to validate an invalid secondaryContact', () => {
      const SECONDARY_CONTACT_ID = 'd7d90c05-f6cd-442c-a168-202db587f16f';

      const myCase = new Case(
        {
          ...MOCK_CASE,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitioners: [
            ...MOCK_CASE.petitioners,
            {
              ...MOCK_CASE.petitioners[0],
              contactId: SECONDARY_CONTACT_ID,
              contactType: CONTACT_TYPES.secondary,
              name: 'Jimmy Jazz',
            },
          ],
        },
        { applicationContext },
      );

      myCase.updatePetitioner({
        contactId: SECONDARY_CONTACT_ID,
        contactType: CONTACT_TYPES.secondary,
        name: undefined,
      });

      const updatedCaseRaw = myCase.validate().toRawObject();

      // send back through the constructor so contacts are recreated as entities
      const updatedCaseEntity = new Case(updatedCaseRaw, {
        applicationContext,
      });

      expect(updatedCaseEntity.isValid()).toBeFalsy();
    });
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

  describe('formattedDocketNumber', () => {
    it('formats docket numbers with leading zeroes', () => {
      expect(Case.formatDocketNumber('00000456-19')).toEqual('456-19');
    });

    it('does not alter properly-formatted docket numbers', () => {
      expect(Case.formatDocketNumber('123456-19')).toEqual('123456-19'); // unchanged
    });

    it('strips letters from docket numbers', () => {
      expect(Case.formatDocketNumber('456-19L')).toEqual('456-19');
    });

    it('strips both leading zeroes and letters from docket numbers', () => {
      expect(Case.formatDocketNumber('00000456-19L')).toEqual('456-19');
    });

    it('does not error when a non docket number is given', () => {
      expect(Case.formatDocketNumber('FRED')).toEqual('FRED');
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
          state: 'AK',
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [...MOCK_CASE.petitioners, ...mockOtherPetitioners],
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
          state: 'AK',
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [getContactPrimary(MOCK_CASE), ...mockOtherFilers],
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
          state: 'AK',
          title: OTHER_FILER_TYPES[2],
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [...MOCK_CASE.petitioners, ...mockOtherFilers],
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
          state: 'AK',
          title: UNIQUE_OTHER_FILER_TYPE,
        },
      ];

      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [...MOCK_CASE.petitioners, ...mockOtherFilers],
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

  describe('markAsSentToIRS', () => {
    it('updates case status to general docket not at issue', () => {
      const caseRecord = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      caseRecord.markAsSentToIRS();
      expect(caseRecord.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    });
  });

  describe('getCaseCaption', () => {
    it('gets the primary contact from the petitioners array', () => {
      const caseCaption = Case.getCaseCaption({
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Bob Smith',
          },
        ],
      });
      expect(caseCaption).toEqual('Bob Smith, Petitioner');
    });

    it('gets the primary contact from contactPrimary property if petitioners array does not exist', () => {
      const caseCaption = Case.getCaseCaption({
        contactPrimary: {
          contactType: CONTACT_TYPES.primary,
          name: 'Bob Smith',
        },
        partyType: PARTY_TYPES.petitioner,
      });
      expect(caseCaption).toEqual('Bob Smith, Petitioner');
    });

    it('party type Petitioner', () => {
      const caseCaption = Case.getCaseCaption(MOCK_CASE);

      expect(caseCaption).toEqual('Test Petitioner, Petitioner');
    });

    it('party type Petitioner & Spouse', () => {
      const caseCaption = Case.getCaseCaption({
        ...MOCK_CASE,
        contactSecondary: {
          name: 'Test Petitioner 2',
        },
        partyType: PARTY_TYPES.petitionerSpouse,
      });
      expect(caseCaption).toEqual(
        'Test Petitioner & Test Petitioner 2, Petitioners',
      );
    });

    it('party type Petitioner & Deceased Spouse', () => {
      const caseCaption = Case.getCaseCaption({
        ...MOCK_CASE,
        contactSecondary: {
          name: 'Test Petitioner 2',
        },
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      });
      expect(caseCaption).toEqual(
        'Test Petitioner & Test Petitioner 2, Deceased, Test Petitioner, Surviving Spouse, Petitioners',
      );
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Estate of Test Petitioner, Deceased, Test Petitioner 2, Executor, Petitioner(s)',
      );
    });

    it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseCaption = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estateWithoutExecutor,
      });

      expect(caseCaption).toEqual(
        'Estate of Test Petitioner, Deceased, Petitioner',
      );
    });

    it('party type Trust', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.trust,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, Trustee, Petitioner(s)',
      );
    });

    it('party type Corporation', () => {
      const caseCaption = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.corporation,
      });
      expect(caseCaption).toEqual('Test Petitioner, Petitioner');
    });

    it('party type Partnership Tax Matters', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership Other Than Tax Matters', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, A Partner Other Than the Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership BBA', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipBBA,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, Partnership Representative, Petitioner(s)',
      );
    });

    it('party type Conservator', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.conservator,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, Conservator, Petitioner',
      );
    });

    it('party type Guardian', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.guardian,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, Guardian, Petitioner',
      );
    });

    it('party type Custodian', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.custodian,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Test Petitioner 2, Custodian, Petitioner',
      );
    });

    it('party type Minor', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForMinor,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Minor, Test Petitioner 2, Next Friend, Petitioner',
      );
    });

    it('party type Legally Incompetent Person', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Incompetent, Test Petitioner 2, Next Friend, Petitioner',
      );
    });

    it('party type Donor', () => {
      const caseCaption = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.donor,
      });

      expect(caseCaption).toEqual('Test Petitioner, Donor, Petitioner');
    });

    it('party type Transferee', () => {
      const caseCaption = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.transferee,
      });

      expect(caseCaption).toEqual('Test Petitioner, Transferee, Petitioner');
    });

    it('party type Surviving Spouse', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.survivingSpouse,
      };
      getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

      const caseCaption = Case.getCaseCaption(mockCase);

      expect(caseCaption).toEqual(
        'Test Petitioner, Deceased, Test Petitioner 2, Surviving Spouse, Petitioner',
      );
    });
  });

  describe('getCaseTitle', () => {
    it('party type Petitioner', () => {
      const caseTitle = Case.getCaseTitle('Test Petitioner, Petitioner');
      expect(caseTitle).toEqual('Test Petitioner');
    });

    it('party type Petitioner & Spouse', () => {
      const caseTitle = Case.getCaseTitle(
        'Test Petitioner & Test Petitioner 2, Petitioners',
      );
      expect(caseTitle).toEqual('Test Petitioner & Test Petitioner 2');
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseTitle(
        'Estate of Test Petitioner 2, Deceased, Test Petitioner, Executor, Petitioner(s)',
      );
      expect(caseTitle).toEqual(
        'Estate of Test Petitioner 2, Deceased, Test Petitioner, Executor',
      );
    });

    it('gets the primary contact from the petitioners array and trims spaces', () => {
      const caseCaption = Case.getCaseCaption({
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: '    Bob Smith                 ',
          },
        ],
      });
      expect(caseCaption).toEqual('Bob Smith, Petitioner');
    });

    it('where a party is an estate, gets the primary contact from the petitioners array and trims spaces from names and titles', () => {
      const caseCaption = Case.getCaseCaption({
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: '    Frank Frink                 ',
            secondaryName: '        Robert Childan            ',
            title: '    Proprietor                 ',
          },
        ],
      });
      expect(caseCaption).toEqual(
        'Estate of Frank Frink, Deceased, Robert Childan, Proprietor, Petitioner(s)',
      );
    });

    it('where party is petitioner and spouse, gets the primary contact from the petitioners array and trims spaces from all names', () => {
      const caseCaption = Case.getCaseCaption({
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: '      John Smith               ',
          },
          {
            contactType: CONTACT_TYPES.secondary,
            name: '         Helen Smith            ',
          },
        ],
      });
      expect(caseCaption).toEqual('John Smith & Helen Smith, Petitioners');
    });
  });

  describe('generateNextDocketRecordIndex', () => {
    it('returns the next possible index based on the current docket record array', () => {
      const caseRecord = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      const nextIndex = caseRecord.generateNextDocketRecordIndex();
      expect(nextIndex).toEqual(2); // because there is one document with isOnDocketRecord = true
    });

    it('returns an index of 1 if the docketEntries array is empty', () => {
      const caseRecord = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [],
        },
        {
          applicationContext,
        },
      );

      const nextIndex = caseRecord.generateNextDocketRecordIndex();
      expect(nextIndex).toEqual(1); // because there is one document with isOnDocketRecord = true
    });
  });

  describe('archiveDocketEntry', () => {
    let caseRecord;
    let docketEntryToArchive;
    beforeEach(() => {
      docketEntryToArchive = {
        archived: undefined,
        docketEntryId: '79c29d3f-d292-482c-b722-388577154664',
        documentType: 'Order',
        eventCode: 'O',
        filedBy: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };

      caseRecord = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [...MOCK_CASE.docketEntries, docketEntryToArchive],
        },
        {
          applicationContext,
        },
      );
    });

    it('marks the docket entry as archived', () => {
      caseRecord.archiveDocketEntry(docketEntryToArchive, {
        applicationContext,
      });
      const archivedDocketEntry = caseRecord.archivedDocketEntries.find(
        d => d.docketEntryId === docketEntryToArchive.docketEntryId,
      );
      expect(archivedDocketEntry.archived).toBeTruthy();
    });

    it('adds the provided docket entry to the case archivedDocketEntries', () => {
      caseRecord.archiveDocketEntry(docketEntryToArchive, {
        applicationContext,
      });

      expect(
        caseRecord.archivedDocketEntries.find(
          d => d.docketEntryId === docketEntryToArchive.docketEntryId,
        ),
      ).toBeDefined();
    });

    it('removes the provided docket entry from the case docketEntries array', () => {
      caseRecord.archiveDocketEntry(docketEntryToArchive, {
        applicationContext,
      });

      expect(
        caseRecord.docketEntries.find(
          d => d.docketEntryId === docketEntryToArchive.docketEntryId,
        ),
      ).toBeUndefined();
    });
  });

  describe('archiveCorrespondence', () => {
    let caseRecord;
    let correspondenceToArchive;
    beforeEach(() => {
      correspondenceToArchive = new Correspondence({
        correspondenceId: '123-abc',
        documentTitle: 'My Correspondence',
        filedBy: 'Docket clerk',
      });

      caseRecord = new Case(
        {
          ...MOCK_CASE,
          correspondence: [correspondenceToArchive],
        },
        {
          applicationContext,
        },
      );
    });

    it('marks the correspondence document as archived', () => {
      caseRecord.archiveCorrespondence(correspondenceToArchive, {
        applicationContext,
      });
      const archivedDocketEntry = caseRecord.archivedCorrespondences.find(
        d => d.correspondenceId === correspondenceToArchive.correspondenceId,
      );
      expect(archivedDocketEntry.archived).toBeTruthy();
    });

    it('adds the provided document to the case archivedDocketEntries', () => {
      caseRecord.archiveCorrespondence(correspondenceToArchive, {
        applicationContext,
      });

      expect(
        caseRecord.archivedCorrespondences.find(
          d => d.correspondenceId === correspondenceToArchive.correspondenceId,
        ),
      ).toBeDefined();
    });
  });

  describe('attachIrsPractitioner', () => {
    it('adds the user to the irsPractitioners', () => {
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      );
      caseToVerify.attachIrsPractitioner(
        new IrsPractitioner({
          userId: 'irsPractitioner',
        }),
      );
      expect(caseToVerify.irsPractitioners).not.toBeNull();
      expect(caseToVerify.irsPractitioners[0].userId).toEqual(
        'irsPractitioner',
      );
    });
  });

  describe('attachPrivatePractitioner', () => {
    it('adds the user to the privatePractitioners', () => {
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      );
      caseToVerify.attachPrivatePractitioner(
        new PrivatePractitioner({
          userId: 'privatePractitioner',
        }),
      );
      expect(caseToVerify.privatePractitioners).not.toBeNull();
      expect(caseToVerify.privatePractitioners[0].userId).toEqual(
        'privatePractitioner',
      );
    });
  });

  describe('addDocketEntry', () => {
    it('attaches the docket entry to the case', () => {
      const caseToVerify = new Case(
        { docketNumber: '123-45' },
        {
          applicationContext,
        },
      );
      caseToVerify.addDocketEntry({
        docketEntryId: '123',
        documentType: 'Answer',
        userId: 'irsPractitioner',
      });
      expect(caseToVerify.docketEntries.length).toEqual(1);
      expect(caseToVerify.docketEntries[0]).toMatchObject({
        docketEntryId: '123',
        docketNumber: '123-45',
        documentType: 'Answer',
        userId: 'irsPractitioner',
      });
    });
  });

  describe('updateDocketNumberRecord records suffix changes', () => {
    it('should create a notice of docket number change document when the suffix updates for an electronically created case', () => {
      const caseToVerify = new Case(
        {
          docketNumber: '123-19',
          initialDocketNumberSuffix: 'S',
          isPaper: false,
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('S');
      caseToVerify.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;
      caseToVerify.updateDocketNumberRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(1);
      expect(caseToVerify.docketEntries[0]).toMatchObject({
        index: 1,
        isMinuteEntry: true,
        isOnDocketRecord: true,
      });
    });

    it('should not create a notice of docket number change document when the suffix updates but the case was created from paper', () => {
      const caseToVerify = new Case(
        {
          docketNumber: '123-19',
          isPaper: true,
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
      caseToVerify.updateDocketNumberRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(0);
    });

    it('should not create a notice of docket number change document if suffix has not changed', () => {
      const caseToVerify = new Case(
        { docketNumber: '123-19' },
        {
          applicationContext,
        },
      );
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
      caseToVerify.updateDocketNumberRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(0);
    });

    it('should add notice of docket number change document when the docket number changes from the last updated docket number', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'A Very Berry New Caption',
          docketEntries: [
            {
              documentTitle:
                "Docket Number is amended from '123-19A' to '123-19B'",
              index: 1,
              isOnDocketRecord: true,
            },
            {
              documentTitle:
                "Docket Number is amended from '123-19B' to '123-19P'",
              index: 2,
              isOnDocketRecord: true,
            },
          ],
          docketNumber: '123-19',
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      );
      caseToVerify.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;
      caseToVerify.updateDocketNumberRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(3);
      expect(caseToVerify.docketEntries[2].documentTitle).toEqual(
        "Docket Number is amended from '123-19P' to '123-19W'",
      );
      expect(caseToVerify.docketEntries[2].eventCode).toEqual('MIND');
      expect(caseToVerify.docketEntries[2].index).toEqual(3);
    });
  });

  describe('updateCaseCaptionDocketRecord', () => {
    it('should not add a notice of caption changed document when the caption is not set', () => {
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      ).updateCaseCaptionDocketRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(0);
    });

    it('should not add a notice of caption changed document when the caption is initially being set', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'Caption',
        },
        {
          applicationContext,
        },
      ).updateCaseCaptionDocketRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(0);
    });

    it('should not add a notice of caption changed document when the caption is equivalent to the initial caption', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'Caption',
          initialCaption: 'Caption',
        },
        {
          applicationContext,
        },
      ).updateCaseCaptionDocketRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(0);
    });

    it('should add a notice of caption changed document with event code MINC when the caption changes from the initial caption', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'A New Caption',
          initialCaption: 'Caption',
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).updateCaseCaptionDocketRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(1);
      expect(caseToVerify.docketEntries[0].eventCode).toEqual('MINC');
    });

    it('should not add a notice of caption changed document when the caption is equivalent to the last updated caption', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'A Very New Caption',
          docketEntries: [
            {
              documentTitle:
                "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
              index: 1,
              isOnDocketRecord: true,
            },
            {
              documentTitle:
                "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
              index: 2,
              isOnDocketRecord: true,
            },
          ],
          initialCaption: 'Caption',
        },
        {
          applicationContext,
        },
      ).updateCaseCaptionDocketRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(2);
    });

    it('should add a notice of caption changed document when the caption changes from the last updated caption', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'A Very Berry New Caption',
          docketEntries: [
            {
              documentTitle:
                "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
              index: 1,
              isOnDocketRecord: true,
            },
            {
              documentTitle:
                "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
              index: 2,
              isOnDocketRecord: true,
            },
          ],
          initialCaption: 'Caption',
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).updateCaseCaptionDocketRecord({
        applicationContext,
      });
      expect(caseToVerify.docketEntries.length).toEqual(3);
      expect(caseToVerify.docketEntries[2]).toMatchObject({
        index: 3,
        isOnDocketRecord: true,
      });
    });
  });

  describe('checkForReadyForTrial', () => {
    it('should not change the status if no answer docketEntries have been filed', () => {
      const caseToCheck = new Case(
        {
          docketEntries: [],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    });

    it('should not change the status if an answer docket entry has been filed, but the cutoff has not elapsed', () => {
      const caseToCheck = new Case(
        {
          docketEntries: [
            {
              createdAt: prepareDateFromString().toISOString(),
              eventCode: 'A',
            },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    });

    it('should not change the status if a non answer docket entry has been filed before the cutoff', () => {
      const caseToCheck = new Case(
        {
          docketEntries: [
            {
              createdAt: prepareDateFromString()
                .subtract(1, 'year')
                .toISOString(),
              eventCode: 'ZZZs',
            },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    });

    it("should NOT change the status to 'Ready for Trial' when an answer document has been filed on the cutoff", () => {
      // eslint-disable-next-line spellcheck/spell-checker
      /*
      Note: As of this writing on 2020-03-20, there may be a bug in the `moment` library as it pertains to
      leap-years and/or leap-days and maybe daylight saving time, too. Meaning that if *this* test runs
      at a time when it is calculating date/time differences across the existence of a leap year and DST, it may fail.
      */
      const caseToCheck = new Case(
        {
          docketEntries: [
            {
              createdAt: prepareDateFromString()
                .subtract(ANSWER_CUTOFF_AMOUNT_IN_DAYS, ANSWER_CUTOFF_UNIT)
                .toISOString(),
              eventCode: 'A',
            },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();

      expect(caseToCheck.status).not.toEqual(
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed before the cutoff but case is not 'Not at issue'", () => {
      const createdAt = prepareDateFromString()
        .subtract(ANSWER_CUTOFF_AMOUNT_IN_DAYS + 10, ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case(
        {
          docketEntries: [
            {
              createdAt,
              eventCode: 'A',
            },
          ],
          status: CASE_STATUS_TYPES.new,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.new);
    });

    it("should change the status to 'Ready for Trial' when an answer document has been filed before the cutoff", () => {
      const createdAt = prepareDateFromString()
        .subtract(ANSWER_CUTOFF_AMOUNT_IN_DAYS + 10, ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case(
        {
          docketEntries: [
            {
              createdAt,
              eventCode: 'A',
            },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );
    });
  });

  describe('generateSortableDocketNumber', () => {
    it('returns undefined if there is no docketNumber property on the case data', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          docketNumber: null,
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateSortableDocketNumber()).toEqual(undefined);
    });

    it('returns a sortable docket number from the case docketNumber property', () => {
      let myCase = new Case(
        {
          ...MOCK_CASE,
          docketNumber: '105-19',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateSortableDocketNumber()).toEqual(19000105);

      myCase = new Case(
        {
          ...MOCK_CASE,
          docketNumber: '2635-19',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateSortableDocketNumber()).toEqual(19002635);

      myCase = new Case(
        {
          ...MOCK_CASE,
          docketNumber: '112635-19',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateSortableDocketNumber()).toEqual(19112635);
    });
  });

  describe('generateTrialSortTags', () => {
    it('should generate sort tags for a regular case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid: 'WashingtonDistrictofColumbia-H-D-20181212000000-101-18',
        nonHybrid: 'WashingtonDistrictofColumbia-R-D-20181212000000-101-18',
      });
    });

    it('should generate sort tags for a small case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          procedureType: 'Small',
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid: 'WashingtonDistrictofColumbia-H-D-20181212000000-101-18',
        nonHybrid: 'WashingtonDistrictofColumbia-S-D-20181212000000-101-18',
      });
    });

    it('should generate sort tags for a prioritized P case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.passport,
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid: 'WashingtonDistrictofColumbia-H-C-20181212000000-101-18',
        nonHybrid: 'WashingtonDistrictofColumbia-R-C-20181212000000-101-18',
      });
    });

    it('should generate sort tags for a prioritized L case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.cdp,
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid: 'WashingtonDistrictofColumbia-H-B-20181212000000-101-18',
        nonHybrid: 'WashingtonDistrictofColumbia-R-B-20181212000000-101-18',
      });
    });

    it('should generate sort tags for a prioritized high priority case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
          procedureType: 'Small',
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid: 'WashingtonDistrictofColumbia-H-A-20181212000000-101-18',
        nonHybrid: 'WashingtonDistrictofColumbia-S-A-20181212000000-101-18',
      });
    });
  });

  describe('setAsCalendared', () => {
    it('should set case as calendared with only judge and trialSessionId if the trial session is calendared', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      myCase.setAsCalendared({
        isCalendared: true,
        judge: {
          name: 'Judge Judy',
        },
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.status).toEqual(CASE_STATUS_TYPES.calendared);
    });

    it('should set case as calendared with all trial session fields if the trial session is calendared', () => {
      const myCase = new Case(
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
      myCase.setAsCalendared(trialSession);

      expect(myCase.status).toEqual(CASE_STATUS_TYPES.calendared);
      expect(myCase.trialDate).toBeTruthy();
      expect(myCase.associatedJudge).toBeTruthy();
      expect(myCase.trialLocation).toBeTruthy();
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.trialTime).toBeTruthy();
    });

    it('should set all trial session fields but not set the case as calendared or associated judge if the trial session is not calendared', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: false,
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
      myCase.setAsCalendared(trialSession);

      expect(myCase.status).toEqual(CASE_STATUS_TYPES.new);
      expect(myCase.trialDate).toBeTruthy();
      expect(myCase.associatedJudge).toEqual(CHIEF_JUDGE);
      expect(myCase.trialLocation).toBeTruthy();
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.trialTime).toBeTruthy();
    });
  });

  describe('updateTrialSessionInformation', () => {
    it('should not change the status of the case', () => {
      const myCase = new Case(
        { ...MOCK_CASE, status: CASE_STATUS_TYPES.closed },
        {
          applicationContext,
        },
      );
      myCase.updateTrialSessionInformation({
        isCalendared: false,
        judge: {
          name: 'Judge Judy',
        },
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      expect(myCase.status).toBe(CASE_STATUS_TYPES.closed);
    });

    it('should set only judge and trialSessionId if the trial session is calendared', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      myCase.updateTrialSessionInformation({
        isCalendared: false,
        judge: {
          name: 'Judge Judy',
        },
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      expect(myCase.trialSessionId).toBeTruthy();
    });

    it('should set all trial session fields if the trial session is calendared', () => {
      const myCase = new Case(
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
      myCase.updateTrialSessionInformation(trialSession);

      expect(myCase.trialDate).toBeTruthy();
      expect(myCase.associatedJudge).toBeTruthy();
      expect(myCase.trialLocation).toBeTruthy();
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.trialTime).toBeTruthy();
    });

    it('should set all trial session fields but not set the associated judge if the trial session is not calendared', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: false,
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
      myCase.setAsCalendared(trialSession);

      expect(myCase.status).toEqual(CASE_STATUS_TYPES.new);
      expect(myCase.trialDate).toBeTruthy();
      expect(myCase.associatedJudge).toEqual(CHIEF_JUDGE);
      expect(myCase.trialLocation).toBeTruthy();
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.trialTime).toBeTruthy();
    });
  });

  describe('closeCase', () => {
    it('should update the status of the case to closed and add a closedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-03-01T21:40:46.415Z',
          blockedReason: 'something else',
          highPriority: true,
          highPriorityReason: 'something',
        },
        {
          applicationContext,
        },
      );
      myCase.closeCase();
      expect(myCase).toMatchObject({
        blocked: false,
        blockedDate: undefined,
        blockedReason: undefined,
        closedDate: expect.anything(),
        highPriority: false,
        highPriorityReason: undefined,
        status: CASE_STATUS_TYPES.closed,
      });
    });
  });

  describe('getDocketEntryById', () => {
    it('should get the docket entry by an Id', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      const result = myCase.getDocketEntryById({
        docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
      });
      expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
    });
  });

  describe('getCorrespondenceById', () => {
    it('should get a correspondence document by id', () => {
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

      const result = myCase.getCorrespondenceById({
        correspondenceId: mockCorrespondence.correspondenceId,
      });

      expect(result.correspondenceId).toEqual(
        mockCorrespondence.correspondenceId,
      );
    });
  });

  describe('getAttachmentDocumentById', () => {
    it('should get a docket entry document', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      const result = Case.getAttachmentDocumentById({
        caseDetail: myCase.toRawObject(),
        docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
      });
      expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
    });

    it('should get a correspondence document', () => {
      const mockCorrespondenceId = '640ac314-0579-4081-8176-88cbe75e16a5';
      const myCase = new Case(
        {
          ...MOCK_CASE,
          correspondence: [
            {
              archived: false,
              correspondenceId: mockCorrespondenceId,
              documentTitle: 'test',
              filingDate: '2019-03-01T21:40:46.415Z',
              userId: 'ec91e317-bfb2-4696-8ae3-064b5c556a56',
            },
          ],
        },
        {
          applicationContext,
        },
      );
      const result = Case.getAttachmentDocumentById({
        caseDetail: myCase.toRawObject(),
        documentId: mockCorrespondenceId,
      });
      expect(result.correspondenceId).toEqual(mockCorrespondenceId);
    });

    it('should get an archived docket entry document if useArchived is true', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          archivedDocketEntries: MOCK_DOCUMENTS,
          docketEntries: [],
        },
        {
          applicationContext,
        },
      );
      const result = Case.getAttachmentDocumentById({
        caseDetail: myCase.toRawObject(),
        documentId: MOCK_DOCUMENTS[0].docketEntryId,
        useArchived: true,
      });
      expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
    });

    it('should return undefined when attempting to get an archived docket entry and useArchived is not pased in', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          archivedDocketEntries: MOCK_DOCUMENTS,
          docketEntries: [],
        },
        {
          applicationContext,
        },
      );
      const result = Case.getAttachmentDocumentById({
        caseDetail: myCase.toRawObject(),
        documentId: MOCK_DOCUMENTS[0].docketEntryId,
      });
      expect(result).toBeUndefined();
    });

    it('should get an archived correspondence document', () => {
      const mockCorrespondenceId = '640ac314-0579-4081-8176-88cbe75e16a5';
      const myCase = new Case(
        {
          ...MOCK_CASE,
          archivedCorrespondences: [
            {
              archived: true,
              correspondenceId: mockCorrespondenceId,
              documentTitle: 'test',
              filingDate: '2019-03-01T21:40:46.415Z',
              userId: 'ec91e317-bfb2-4696-8ae3-064b5c556a56',
            },
          ],
        },
        {
          applicationContext,
        },
      );
      const result = Case.getAttachmentDocumentById({
        caseDetail: myCase.toRawObject(),
        documentId: mockCorrespondenceId,
        useArchived: true,
      });
      expect(result.correspondenceId).toEqual(mockCorrespondenceId);
    });
  });

  describe('deleteDocketEntryById', () => {
    it('should delete the document with the given id', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      const docketEntryIdToDelete = MOCK_DOCUMENTS[1].docketEntryId;
      expect(myCase.docketEntries.length).toEqual(4);
      myCase.deleteDocketEntryById({
        docketEntryId: docketEntryIdToDelete,
      });
      expect(myCase.docketEntries.length).toEqual(3);
      expect(
        myCase.docketEntries.find(
          d => d.docketEntryId === docketEntryIdToDelete,
        ),
      ).toBeUndefined();
    });

    it('should not delete a document if a document with the given id does not exist', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      const docketEntryIdToDelete = '016fda7d-eb0a-4194-b603-ef422c898122';
      expect(myCase.docketEntries.length).toEqual(4);
      myCase.deleteDocketEntryById({
        docketEntryId: docketEntryIdToDelete,
      });
      expect(myCase.docketEntries.length).toEqual(4);
    });
  });

  describe('deleteCorrespondenceById', () => {
    const mockCorrespondence = new Correspondence({
      documentTitle: 'A correpsondence',
      filingDate: '2025-03-01T00:00:00.000Z',
      userId: MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'].userId,
    });

    it('should delete the correspondence document with the given id', () => {
      const myCase = new Case(
        { ...MOCK_CASE, correspondence: [mockCorrespondence] },
        {
          applicationContext,
        },
      );
      expect(myCase.correspondence.length).toEqual(1);
      myCase.deleteCorrespondenceById({
        correspondenceId: mockCorrespondence.correspondenceId,
      });
      expect(myCase.correspondence.length).toEqual(0);
      expect(
        myCase.correspondence.find(
          d => d.correspondenceId === mockCorrespondence.correspondenceId,
        ),
      ).toBeUndefined();
    });

    it('should not delete a document if a document with the given id does not exist', () => {
      const myCase = new Case(
        { ...MOCK_CASE, correspondence: [mockCorrespondence] },
        {
          applicationContext,
        },
      );
      expect(myCase.correspondence.length).toEqual(1);
      myCase.deleteCorrespondenceById({
        correspondenceId: '1234',
      });
      expect(myCase.correspondence.length).toEqual(1);
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

    describe('setLeadCase', () => {
      it('Should set the leadDocketNumber on the given case', async () => {
        const leadDocketNumber = '101-20';
        const caseEntity = new Case(
          {
            ...MOCK_CASE,
            preferredTrialCity: 'Birmingham, Alabama',
            procedureType: 'Regular',
            status: CASE_STATUS_TYPES.submitted,
          },
          { applicationContext },
        );
        const result = caseEntity.setLeadCase(leadDocketNumber);

        expect(result.leadDocketNumber).toEqual(leadDocketNumber);
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

    describe('sortByDocketNumber', () => {
      it('Should return the cases as an array sorted by docket number for cases filed in the same year', () => {
        const result = Case.sortByDocketNumber([
          {
            docketNumber: '110-19',
          },
          {
            docketNumber: '100-19',
          },
          {
            docketNumber: '120-19',
          },
        ]);

        expect(result).toEqual([
          {
            docketNumber: '100-19',
          },
          {
            docketNumber: '110-19',
          },
          {
            docketNumber: '120-19',
          },
        ]);
      });

      it('Should return the cases as an array sorted by docket number for cases filed in different years', () => {
        const result = Case.sortByDocketNumber([
          {
            docketNumber: '100-19',
          },
          {
            docketNumber: '110-18',
          },
          {
            docketNumber: '120-19',
          },
          {
            docketNumber: '120-18',
          },
        ]);

        expect(result).toEqual([
          {
            docketNumber: '110-18',
          },
          {
            docketNumber: '120-18',
          },
          {
            docketNumber: '100-19',
          },
          {
            docketNumber: '120-19',
          },
        ]);
      });
    });

    describe('findLeadCaseForCases', () => {
      it('Should return the case with the lowest docket number for cases filed in the same year', () => {
        const result = Case.findLeadCaseForCases([
          {
            docketNumber: '110-19',
          },
          {
            docketNumber: '100-19',
          },
          {
            docketNumber: '120-19',
          },
        ]);

        expect(result.docketNumber).toEqual('100-19');
      });

      it('Should return the case with the lowest docket number for cases filed in different years', () => {
        const result = Case.findLeadCaseForCases([
          {
            docketNumber: '100-19',
          },
          {
            docketNumber: '110-18',
          },
          {
            docketNumber: '120-19',
          },
        ]);

        expect(result.docketNumber).toEqual('110-18');
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

  describe('setNoticeOfTrialDate', () => {
    it('should set noticeOfTrialDate on the given case', () => {
      const caseEntity = new Case(MOCK_CASE, { applicationContext });
      const result = caseEntity.setNoticeOfTrialDate();

      expect(result.isValid()).toBeTruthy();
    });

    it('should set noticeOfTrialDate when passed through Case constructor', () => {
      const isoDateString = applicationContext
        .getUtilities()
        .createISODateString();

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          noticeOfTrialDate: isoDateString,
        },
        { applicationContext },
      );

      expect(caseEntity.isValid()).toBeTruthy();
      expect(caseEntity.noticeOfTrialDate).toEqual(isoDateString);
    });
  });

  describe('setQcCompleteForTrial', () => {
    it('should set qcCompleteForTrial on the given case for the given trial session id', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          qcCompleteForTrial: { 'd6fdd6e7-8dfa-463a-8a17-ed4512d1a68d': false },
        },
        { applicationContext },
      );
      const result = caseEntity.setQcCompleteForTrial({
        qcCompleteForTrial: true,
        trialSessionId: 'da61b7b3-5854-4434-a116-9e4135af60e0',
      });

      expect(result.isValid()).toBeTruthy();
      expect(result.qcCompleteForTrial).toEqual({
        'd6fdd6e7-8dfa-463a-8a17-ed4512d1a68d': false,
        'da61b7b3-5854-4434-a116-9e4135af60e0': true,
      });
    });

    it('should default qcCompleteForTrial to an empty object if not provided when entity is constructed', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
        },
        { applicationContext },
      );

      expect(caseEntity.isValid()).toBeTruthy();
      expect(caseEntity.qcCompleteForTrial).toEqual({});
    });

    it('should set qcCompleteForTrial to value provided when passed through Case constructor', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          qcCompleteForTrial: { '80950eee-7efd-4374-a642-65a8262135ab': true },
        },
        { applicationContext },
      );

      expect(caseEntity.isValid()).toBeTruthy();
      expect(caseEntity.qcCompleteForTrial).toEqual({
        '80950eee-7efd-4374-a642-65a8262135ab': true,
      });
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

  describe('isAssociatedUser', () => {
    let caseEntity;
    const CONTACT_PRIMARY_ID = '3855b2dd-4094-4526-acc0-b48d7eed1f28';
    const CONTACT_SECONDARY_ID = '90035070-d10f-49cc-b08c-bb9d09993f5b';
    beforeEach(() => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      );
      caseEntity = new Case(
        {
          ...MOCK_CASE,
          contactSecondary: {
            ...MOCK_CASE.contactPrimary,
            contactId: CONTACT_SECONDARY_ID,
          },
          irsPractitioners: [
            { userId: '4c644ac6-e5bc-4905-9dc8-d658f25a8e72' },
          ],
          partyType: PARTY_TYPES.petitionerSpouse,
          petitioners: [
            {
              ...getContactPrimary(MOCK_CASE),
              contactId: CONTACT_PRIMARY_ID,
            },
          ],
          privatePractitioners: [
            { userId: '271e5918-6461-4e67-bc38-274bc0aa0248' },
          ],
        },
        {
          applicationContext,
        },
      );
    });

    it('returns true if the user is an irsPractitioner on the case', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: { userId: '4c644ac6-e5bc-4905-9dc8-d658f25a8e72' },
      });

      expect(isAssociated).toBeTruthy();
    });

    it('returns true if the user is a privatePractitioner on the case', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: { userId: '271e5918-6461-4e67-bc38-274bc0aa0248' },
      });

      expect(isAssociated).toBeTruthy();
    });

    it('returns false if the user is an irs superuser but the petition document is not served', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: {
          role: ROLES.irsSuperuser,
          userId: '098d5055-dd90-42af-aec9-056a9843a7e0',
        },
      });

      expect(isAssociated).toBeFalsy();
    });

    it('returns true if the user is an irs superuser and the petition document is served', () => {
      caseEntity.docketEntries = [
        {
          documentType: 'Petition',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ];

      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: {
          role: ROLES.irsSuperuser,
          userId: '098d5055-dd90-42af-aec9-056a9843a7e0',
        },
      });

      expect(isAssociated).toBeTruthy();
    });

    it('returns false if the user is an irs superuser and the case does not have docketEntries', () => {
      caseEntity.docketEntries = undefined;

      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity,
        user: {
          role: ROLES.irsSuperuser,
          userId: '098d5055-dd90-42af-aec9-056a9843a7e0',
        },
      });

      expect(isAssociated).toBeFalsy();
    });

    it('returns false if the user is a not a privatePractitioner or irsPractitioner on the case and is not an irs superuser', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: { userId: '4b32e14b-f583-4631-ba44-1439a093d6d0' },
      });

      expect(isAssociated).toBeFalsy();
    });

    it('returns true if the user is the primary contact on the case', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: { userId: CONTACT_PRIMARY_ID },
      });

      expect(isAssociated).toBeTruthy();
    });

    it('returns true if the user is the secondary contact on the case', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: caseEntity.toRawObject(),
        user: { userId: CONTACT_SECONDARY_ID },
      });

      expect(isAssociated).toBeTruthy();
    });

    it('should return true when the petition docket entry has been served in the legacy system and the current user is an irs superuser', () => {
      const isAssociated = isAssociatedUser({
        caseRaw: {
          ...caseEntity.toRawObject(),
          docketEntries: [
            {
              documentTitle: 'Petition',
              documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
              isLegacyServed: true,
              servedAt: undefined,
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
        user: { role: ROLES.irsSuperuser },
      });

      expect(isAssociated).toBeTruthy();
    });
  });

  describe('getCaseConfirmationGeneratedPdfFileName', () => {
    it('generates the correct name for the case confirmation pdf', () => {
      const caseToVerify = new Case(
        {
          docketNumber: '123-20',
        },
        {
          applicationContext,
        },
      );
      expect(caseToVerify.getCaseConfirmationGeneratedPdfFileName()).toEqual(
        'case-123-20-confirmation.pdf',
      );
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

  describe('addCorrespondence', () => {
    it('should successfully add correspondence', () => {
      const caseEntity = new Case(MOCK_CASE, { applicationContext });

      caseEntity.fileCorrespondence({
        correspondenceId: 'yeehaw',
        documentTitle: 'Correspondence document',
      });

      expect(caseEntity.correspondence.length).toEqual(1);
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

  describe('isSealed', () => {
    it('marks case as sealed if it has at least one document with isSealed = true', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [
            ...MOCK_DOCUMENTS,
            {
              ...MOCK_DOCUMENTS[0],
              isSealed: true,
            },
          ],
        },
        { applicationContext },
      );

      expect(caseEntity.isSealed).toBeTruthy();
    });

    it('marks case as sealed if it has at least one document with isLegacySealed = true', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          docketEntries: [
            ...MOCK_DOCUMENTS,
            {
              ...MOCK_DOCUMENTS[0],
              isLegacySealed: true,
            },
          ],
        },
        { applicationContext },
      );

      expect(caseEntity.isSealed).toBeTruthy();
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

  describe('hasPartyWithServiceType', () => {
    it('should return true if contactPrimary service indicator is paper', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          petitioners: [
            {
              ...getContactPrimary(MOCK_CASE),
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
        },
        { applicationContext },
      );

      const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );

      expect(hasPartyWithPaperService).toBeTruthy();
    });

    it('should return true if contactSecondary service indicator is paper', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitioners: [
            {
              ...getContactPrimary(MOCK_CASE),
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            },
            {
              ...getContactPrimary(MOCK_CASE),
              contactType: CONTACT_TYPES.secondary,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
        },
        { applicationContext },
      );

      const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );

      expect(hasPartyWithPaperService).toBeTruthy();
    });

    it('should return true if any privatePractitioner has paper service indicator', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          privatePractitioners: [
            {
              name: 'Bob Barker',
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              userId: '919b8ead-d8ec-487d-a0c0-4e136a566f74',
            },
          ],
        },
        { applicationContext },
      );

      const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );

      expect(hasPartyWithPaperService).toBeTruthy();
    });

    it('should return true if any irsPractitioner has paper service indicator', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          irsPractitioners: [
            {
              name: 'Bob Barker',
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              userId: '919b8ead-d8ec-487d-a0c0-4e136a566f74',
            },
          ],
        },
        { applicationContext },
      );

      const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );

      expect(hasPartyWithPaperService).toBeTruthy();
    });

    it('should return false if no contacts or practitioners have paper service indicator', () => {
      const myCase = new Case(MOCK_CASE, { applicationContext });

      const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );

      expect(hasPartyWithPaperService).toBeFalsy();
    });
  });

  describe('getSortableDocketNumber', () => {
    it('should sort in the correct order', () => {
      const numbers = [
        Case.getSortableDocketNumber('19844-12'),
        Case.getSortableDocketNumber('5520-08'),
        Case.getSortableDocketNumber('1773-11'),
        Case.getSortableDocketNumber('5242-10'),
        Case.getSortableDocketNumber('1144-05'),
      ].sort((a, b) => a - b);
      expect(numbers).toEqual([5001144, 8005520, 10005242, 11001773, 12019844]);
    });
  });

  describe('isSealedCase', () => {
    it('returns false for objects without any truthy sealed attributes', () => {
      const result = isSealedCase({
        docketEntries: [],
        isSealed: false,
        name: 'Johnny Appleseed',
        sealedDate: false,
      });
      expect(result).toBe(false);
    });

    it('returns true if the object has truthy values for isSealed or isSealedDate', () => {
      expect(isSealedCase({ isSealed: true })).toBe(true);
      expect(
        isSealedCase({
          sealedDate: applicationContext.getUtilities().createISODateString(),
        }),
      ).toBe(true);
    });

    it('returns true if the object has a docket entry with truthy values for isSealed or isLegacySealed', () => {
      expect(
        isSealedCase({
          docketEntries: [{ isSealed: true }],
          isSealed: false,
          name: 'Johnny Appleseed',
          sealedDate: false,
        }),
      ).toBe(true);
      expect(
        isSealedCase({
          docketEntries: [{ isLegacySealed: true }],
          isSealed: false,
          name: 'Johnny Appleseed',
          sealedDate: false,
        }),
      ).toBe(true);
    });
  });

  describe('caseHasServedDocketEntries', () => {
    it('should return true if the case has any docket entry with isLegacyServed set to true', () => {
      expect(
        caseHasServedDocketEntries({
          docketEntries: [{ isLegacyServed: true }],
        }),
      ).toBeTruthy();
    });

    it('should return true if the case has any docket entry with servedAt defined', () => {
      expect(
        caseHasServedDocketEntries({
          docketEntries: [{ servedAt: '2019-08-25T05:00:00.000Z' }],
        }),
      ).toBeTruthy();
    });

    it('should return false if the case does not have any docket entries with isLegacyServed set to true or servedAt', () => {
      expect(
        caseHasServedDocketEntries({
          docketEntries: [{ isLegacyServed: false }],
        }),
      ).toBeFalsy();
    });

    it('should return false if the case does not have any docket entries', () => {
      expect(
        caseHasServedDocketEntries({
          docketEntries: [],
        }),
      ).toBeFalsy();
    });
  });

  describe('removeFromHearing', () => {
    it('removes the hearing from the case', () => {
      const trialSessionHearing = new TrialSession(
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
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
          hearings: [trialSessionHearing],
        },
        {
          applicationContext,
        },
      );
      caseToUpdate.removeFromHearing(trialSessionHearing.trialSessionId);

      expect(caseToUpdate.hearings).toEqual([]);
    });
  });

  describe('isHearing', () => {
    it('checks if the given trialSessionId is a hearing (true)', () => {
      const trialSessionHearing = new TrialSession(
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
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
          hearings: [trialSessionHearing],
        },
        {
          applicationContext,
        },
      );

      expect(
        caseToUpdate.isHearing(trialSessionHearing.trialSessionId),
      ).toEqual(true);
    });

    it('checks if the given trialSessionId is a hearing (false)', () => {
      const trialSessionHearing = new TrialSession(
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
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      caseToUpdate.setAsCalendared(trialSessionHearing);

      expect(
        caseToUpdate.isHearing(trialSessionHearing.trialSessionId),
      ).toEqual(false);
    });
  });

  describe('hasPrivatePractitioners', () => {
    it('returns true when there are privatePractitioners on the case', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          privatePractitioners: [
            {
              barNumber: 'OK0063',
              contact: {
                address1: '5943 Joseph Summit',
                address2: 'Suite 334',
                address3: null,
                city: 'Millermouth',
                country: 'U.S.A.',
                countryType: 'domestic',
                phone: '348-858-8312',
                postalCode: '99517',
                state: 'AK',
              },
              email: 'thomastorres@example.com',
              entityName: 'PrivatePractitioner',
              name: 'Brandon Choi',
              role: 'privatePractitioner',
              serviceIndicator: 'Electronic',
              userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
            },
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseEntity.hasPrivatePractitioners()).toEqual(true);
    });

    it('returns false when there are NO privatePractitioners on the case', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          privatePractitioners: [],
        },
        {
          applicationContext,
        },
      );

      expect(caseEntity.hasPrivatePractitioners()).toEqual(false);
    });
  });

  describe('isUserIdRepresentedByPrivatePractitioner', () => {
    let caseEntity;

    beforeAll(() => {
      caseEntity = new Case(
        {
          ...MOCK_CASE,
          privatePractitioners: [
            {
              barNumber: 'PP123',
              representing: ['123'],
            },
            {
              barNumber: 'PP234',
              representing: ['234', '456'],
            },
          ],
        },
        {
          applicationContext,
        },
      );
    });
    it('returns true if there is a privatePractitioner representing the given userId', () => {
      expect(
        caseEntity.isUserIdRepresentedByPrivatePractitioner('456'),
      ).toEqual(true);
    });

    it('returns false if there is NO privatePractitioner representing the given userId', () => {
      expect(
        caseEntity.isUserIdRepresentedByPrivatePractitioner('678'),
      ).toEqual(false);
    });
  });

  describe('getShouldHaveTrialSortMappingRecords', () => {
    it('returns true if the case is high priority, has a preferred trial city, and is not blocked', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          blocked: false,
          highPriority: true,
          preferredTrialCity: 'Somecity',
          status: CASE_STATUS_TYPES.generalDocket,
        },
        { applicationContext },
      );

      expect(caseEntity.getShouldHaveTrialSortMappingRecords()).toEqual(true);
    });

    it('returns true if the case is high priority, has a preferred trial city, is not blocked, and has automatic block', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          automaticBlocked: true,
          blocked: false,
          highPriority: true,
          preferredTrialCity: 'Somecity',
          status: CASE_STATUS_TYPES.generalDocket,
        },
        { applicationContext },
      );

      expect(caseEntity.getShouldHaveTrialSortMappingRecords()).toEqual(true);
    });

    it('returns true if the case status is ready for trial, has a preferred trial city, is not blocked, and has NO automatic block', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          blocked: false,
          highPriority: false,
          preferredTrialCity: 'Somecity',
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        },
        { applicationContext },
      );

      expect(caseEntity.getShouldHaveTrialSortMappingRecords()).toEqual(true);
    });

    it('returns false if the case is blocked', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          highPriority: false,
          preferredTrialCity: 'Somecity',
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        },
        { applicationContext },
      );

      expect(caseEntity.getShouldHaveTrialSortMappingRecords()).toEqual(false);
    });

    it('returns false if the case does not have a prefered trial city', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          blocked: false,
          highPriority: false,
          preferredTrialCity: undefined,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        },
        { applicationContext },
      );

      expect(caseEntity.getShouldHaveTrialSortMappingRecords()).toEqual(false);
    });

    it('returns false if the case status is ready for trial, has a preferred trial city, is not blocked, and has automatic block', () => {
      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          automaticBlocked: true,
          blocked: true,
          highPriority: false,
          preferredTrialCity: 'Somecity',
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        },
        { applicationContext },
      );

      expect(caseEntity.getShouldHaveTrialSortMappingRecords()).toEqual(false);
    });
  });
});

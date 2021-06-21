/* eslint-disable max-lines */
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
  INITIAL_DOCUMENT_TYPES,
  OTHER_FILER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const { Case, getContactPrimary } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { MOCK_USERS } = require('../../../test/mockUsers');

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
        ...mockhearing1,
        createdAt: '2024-01-01T00:00:00.000Z',
        startDate: '2025-01-01T00:00:00.000Z',
      };
      const mockhearing3 = {
        ...mockhearing1,
        createdAt: '2024-02-01T00:00:00.000Z',
        startDate: '2025-02-01T00:00:00.000Z',
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

  describe('filtered', () => {
    it('does not return private data if filtered is true and the user is external', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //petitioner user

      const myCase = new Case(
        {
          ...MOCK_CASE,
          archivedDocketEntries: [...MOCK_DOCUMENTS],
          associatedJudge: CHIEF_JUDGE,
        },
        {
          applicationContext,
          filtered: true,
        },
      );

      expect(Object.keys(myCase)).not.toContain('associatedJudge');
      expect(Object.keys(myCase)).not.toContain('archivedDocketEntries');
    });

    it('returns private data if filtered is true and the user is internal', () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      ); //docketclerk user

      const myCase = new Case(
        {
          ...MOCK_CASE,
          archivedDocketEntries: [...MOCK_DOCUMENTS],
          associatedJudge: CHIEF_JUDGE,
        },
        {
          applicationContext,
          filtered: true,
        },
      );

      expect(Object.keys(myCase)).toContain('associatedJudge');
      expect(Object.keys(myCase)).toContain('archivedDocketEntries');
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

  describe('Other Filers', () => {
    it('fails validation with more than one unique filer type', () => {
      const mockOtherFilers = [
        {
          address1: '42 Lamb Sauce Blvd',
          city: 'Nashville',
          contactType: CONTACT_TYPES.intervenor,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'gordon@example.com',
          name: 'Gordon Ramsay',
          phone: '1234567890',
          postalCode: '05198',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'AK',
          title: UNIQUE_OTHER_FILER_TYPE,
        },
        {
          address1: '1337 12th Ave',
          city: 'Flavortown',
          // fails because there cannot be more than 1 filer with this type
          contactType: CONTACT_TYPES.intervenor,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'mayor@example.com',
          name: 'Guy Fieri',
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
      expect(() =>
        new Case(MOCK_CASE, {
          applicationContext,
        }).validate(),
      ).not.toThrow();
    });

    it('should throw an error on invalid cases', () => {
      expect(() =>
        new Case(
          {},
          {
            applicationContext,
          },
        ).validate(),
      ).toThrow();
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

  describe('trialDate and trialSessionId validation', () => {
    it('should fail validation when trialSessionId is defined and trialDate is undefined', () => {
      const blockedCalendaredCase = {
        ...MOCK_CASE,
        trialSessionId: '0762e545-8cbc-4a18-ab7a-27d205c83f60',
      };
      const myCase = new Case(blockedCalendaredCase, { applicationContext });
      expect(myCase.getFormattedValidationErrors()).toEqual({
        trialDate: '"trialDate" is required',
      });
    });

    it('should fail validation when case status is calendared, trialDate is defined and trialSessionId is undefined', () => {
      const blockedCalendaredCase = {
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
      const blockedCalendaredCase = {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
        trialDate: undefined,
        trialSessionId: undefined,
      };
      const myCase = new Case(blockedCalendaredCase, { applicationContext });
      expect(myCase.getFormattedValidationErrors()).toBe(null);
    });

    it('should pass validation when case status is calendared, trialDate is defined and trialSessionId is defined', () => {
      const blockedCalendaredCase = {
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

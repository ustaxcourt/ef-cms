const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseDeadlinesInteractor } = require('./getCaseDeadlinesInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('getCaseDeadlinesInteractor', () => {
  const mockDeadlines = [
    {
      associatedJudge: 'Judge Buch',
      caseDeadlineId: '22c0736f-c4c5-4ab5-97c3-e41fb06bbc2f',
      createdAt: '2019-01-01T21:40:46.415Z',
      deadlineDate: '2019-03-01T21:40:46.415Z',
      description: 'A deadline!',
      docketNumber: '101-19',
    },
    {
      associatedJudge: 'Judge Carluzzo',
      caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
      createdAt: '2019-02-01T21:40:46.415Z',
      deadlineDate: '2019-04-01T21:40:46.415Z',
      description: 'A different deadline!',
      docketNumber: '102-19',
    },
  ];

  const mockCases = [
    {
      associatedJudge: 'Judge A',
      caseCaption: 'A caption, Petitioner',
      caseType: CASE_TYPES_MAP.cdp,
      docketNumber: '101-19',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
      ],
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    },
    {
      associatedJudge: 'Judge A',
      caseCaption: 'Another caption, Petitioner',
      caseType: CASE_TYPES_MAP.cdp,
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Gal Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
      docketNumber: '102-19',
      partyType: PARTY_TYPES.petitioner,
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    },
  ];

  const mockPetitionsClerk = new User({
    name: 'Test Petitionsclerk',
    role: ROLES.petitionsClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  const START_DATE = '2019-08-25T05:00:00.000Z';
  const END_DATE = '2020-08-25T05:00:00.000Z';

  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDateRange.mockReturnValue({
        foundDeadlines: mockDeadlines,
        totalCount: 2,
      });
    applicationContext
      .getPersistenceGateway()
      .getCasesByDocketNumbers.mockReturnValue(mockCases);
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue(new User({}));

    await expect(
      getCaseDeadlinesInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('gets all the case deadlines and combines them with case data', async () => {
    const result = await getCaseDeadlinesInteractor(applicationContext, {});

    expect(result).toEqual({
      deadlines: [
        {
          associatedJudge: 'Judge Buch',
          caseCaption: 'A caption, Petitioner',
          caseDeadlineId: '22c0736f-c4c5-4ab5-97c3-e41fb06bbc2f',
          createdAt: '2019-01-01T21:40:46.415Z',
          deadlineDate: '2019-03-01T21:40:46.415Z',
          description: 'A deadline!',
          docketNumber: '101-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          docketNumberWithSuffix: '101-19L',
          entityName: 'CaseDeadline',
          sortableDocketNumber: 19000101,
        },
        {
          associatedJudge: 'Judge Carluzzo',
          caseCaption: 'Another caption, Petitioner',
          caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
          createdAt: '2019-02-01T21:40:46.415Z',
          deadlineDate: '2019-04-01T21:40:46.415Z',
          description: 'A different deadline!',
          docketNumber: '102-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          docketNumberWithSuffix: '102-19L',
          entityName: 'CaseDeadline',
          sortableDocketNumber: 19000102,
        },
      ],
      totalCount: 2,
    });
  });

  it('passes date and filtering params to getCaseDeadlinesByDateRange persistence call', async () => {
    await getCaseDeadlinesInteractor(applicationContext, {
      endDate: END_DATE,
      from: 20,
      judge: 'Buch',
      pageSize: 50,
      startDate: START_DATE,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseDeadlinesByDateRange
        .mock.calls[0][0],
    ).toMatchObject({
      endDate: END_DATE,
      from: 20,
      judge: 'Buch',
      pageSize: 50,
      startDate: START_DATE,
    });
  });

  it('logs an error for any case that fails validation and includes all cases that pass validation', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByDocketNumbers.mockReturnValue([
        ...mockCases,
        {
          ...MOCK_CASE,
          docketNumber: '2000-20',
          hearings: [
            {
              address1: '200 Second St NW',
              caseOrder: [
                {
                  addedToSessionAt: '2020-12-23T14:21:54.970Z',
                  calendarNotes: 'Remote Subpoena Hearing',
                  docketNumber: '2000-20',
                  isManuallyAdded: true,
                },
              ],
              city: 'Washington',
              courthouseName: 'US Tax Courthouse',
              createdAt: '2020-12-23T14:20:52.766Z',
              entityName: 'TrialSession',
              isCalendared: true,
              judge: {
                name: 'Carluzzo',
                userId: 'a22f4615-1234-4321-9284-30af3e22e715',
              },
              maxCases: '100',
              postalCode: '20217',
              // missing proceedingType; should throw an error!
              sessionType: 'Special',
              startDate: '2021-01-27T05:00:00.000Z',
              startTime: '13:00',
              state: 'DC',
              term: 'Winter',
              termYear: '2021',
              trialClerk: {
                name: 'Aisha Miller',
                userId: '1e68fefe-asdf-fdsa-b08d-d806dd85c979',
              },
              trialLocation: 'Washington, District of Columbia',
              trialSessionId: 'bac57bdb-1123-3321-81e3-b6fb6c337c3c',
            },
          ],
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDateRange.mockReturnValue({
        foundDeadlines: [
          ...mockDeadlines,
          {
            associatedJudge: 'Judge Carluzzo',
            caseDeadlineId: 'c63d6904-1234-4321-8259-9f8f65824bb7',
            createdAt: '2019-02-01T21:40:46.415Z',
            deadlineDate: '2019-04-01T21:40:46.415Z',
            description: 'Yet anotherA deadline!',
            docketNumber: '2000-20',
          },
        ],
        totalCount: 3,
      });

    const result = await getCaseDeadlinesInteractor(applicationContext, {});

    expect(result).toEqual({
      deadlines: [
        {
          associatedJudge: 'Judge Buch',
          caseCaption: 'A caption, Petitioner',
          caseDeadlineId: '22c0736f-c4c5-4ab5-97c3-e41fb06bbc2f',
          createdAt: '2019-01-01T21:40:46.415Z',
          deadlineDate: '2019-03-01T21:40:46.415Z',
          description: 'A deadline!',
          docketNumber: '101-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          docketNumberWithSuffix: '101-19L',
          entityName: 'CaseDeadline',
          sortableDocketNumber: 19000101,
        },
        {
          associatedJudge: 'Judge Carluzzo',
          caseCaption: 'Another caption, Petitioner',
          caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
          createdAt: '2019-02-01T21:40:46.415Z',
          deadlineDate: '2019-04-01T21:40:46.415Z',
          description: 'A different deadline!',
          docketNumber: '102-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          docketNumberWithSuffix: '102-19L',
          entityName: 'CaseDeadline',
          sortableDocketNumber: 19000102,
        },
      ],
      totalCount: 3,
    });
    expect(applicationContext.logger.error).toBeCalled();
  });
});

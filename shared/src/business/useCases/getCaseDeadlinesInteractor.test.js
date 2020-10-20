const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseDeadlinesInteractor } = require('./getCaseDeadlinesInteractor');
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
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
      docketNumber: '101-19',
      partyType: PARTY_TYPES.petitioner,
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
      getCaseDeadlinesInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('gets all the case deadlines and combines them with case data', async () => {
    const result = await getCaseDeadlinesInteractor({
      applicationContext,
    });

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
          entityName: 'CaseDeadline',
          sortableDocketNumber: 19000102,
        },
      ],
      totalCount: 2,
    });
  });

  it('passes date and filtering params to getCaseDeadlinesByDateRange persistence call', async () => {
    await getCaseDeadlinesInteractor({
      applicationContext,
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
});

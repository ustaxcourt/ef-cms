const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getAllCaseDeadlinesInteractor,
} = require('./getAllCaseDeadlinesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { User } = require('../entities/User');

describe('getAllCaseDeadlinesInteractor', () => {
  const mockDeadlines = [
    {
      caseDeadlineId: '22c0736f-c4c5-4ab5-97c3-e41fb06bbc2f',
      createdAt: '2019-01-01T21:40:46.415Z',
      deadlineDate: '2019-03-01T21:40:46.415Z',
      description: 'A deadline!',
      docketNumber: '101-19',
    },
    {
      caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
      createdAt: '2019-02-01T21:40:46.415Z',
      deadlineDate: '2019-04-01T21:40:46.415Z',
      description: 'A different deadline!',
      docketNumber: '102-19',
    },
  ];
  const mockCases = [
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'A caption, Petitioner',
      caseId: '01eebcc4-08aa-4550-b41b-982ffbd75192',
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
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Another caption, Petitioner',
      caseId: '92635235-52c2-445a-9aa0-2a629bb158ed',
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
    },
  ];

  beforeAll(() => {
    applicationContext.environment.stage = 'local';
    applicationContext
      .getPersistenceGateway()
      .getAllCaseDeadlines.mockReturnValue(mockDeadlines);
    applicationContext
      .getPersistenceGateway()
      .getCasesByDocketNumbers.mockReturnValue(mockCases);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue(new User({}));

    await expect(
      getAllCaseDeadlinesInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('gets all the case deadlines and combines them with case data', async () => {
    const mockPetitionsClerk = new User({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);

    const caseDeadlines = await getAllCaseDeadlinesInteractor({
      applicationContext,
    });

    expect(caseDeadlines).toEqual([
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
      },
      {
        associatedJudge: 'Judge Buch',
        caseCaption: 'Another caption, Petitioner',
        caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
        createdAt: '2019-02-01T21:40:46.415Z',
        deadlineDate: '2019-04-01T21:40:46.415Z',
        description: 'A different deadline!',
        docketNumber: '102-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
        entityName: 'CaseDeadline',
      },
    ]);
  });
});

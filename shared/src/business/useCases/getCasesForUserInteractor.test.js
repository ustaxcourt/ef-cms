const { applicationContext } = require('../test/createTestApplicationContext');
const { getCasesForUserInteractor } = require('./getCasesForUserInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
jest.mock('../entities/UserCase');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { UserCase } = require('../entities/UserCase');

describe('getCasesForUserInteractor', () => {
  let mockFoundCasesList;

  beforeEach(() => {
    mockFoundCasesList = [MOCK_CASE];

    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockImplementation(() => mockFoundCasesList);

    applicationContext
      .getUseCaseHelpers()
      .processUserAssociatedCases.mockReturnValue({
        casesAssociatedWithUserOrLeadCaseMap: {
          '101-18': MOCK_CASE,
        },
        leadDocketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
        userAssociatedDocketNumbersMap: {},
      });

    applicationContext
      .getUseCaseHelpers()
      .getConsolidatedCasesForLeadCase.mockReturnValue([]);

    UserCase.validateRawCollection.mockImplementation(foundCases => foundCases);
  });

  it('should retrieve the current user information', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(applicationContext.getCurrentUser).toBeCalled();
  });

  it('should make a call to retrieve open and closed cases for the current user', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should validate the list of cases found for the current user', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(UserCase.validateRawCollection).toBeCalled();
  });

  it('should return a list of open cases sorted by createdAt date descending', async () => {
    const createdToday = applicationContext
      .getUtilities()
      .createISODateString();
    const createdYesterday = applicationContext
      .getUtilities()
      .calculateISODate({ dateString: createdToday, howMuch: -1 });
    mockFoundCasesList = [
      {
        ...MOCK_CASE,
        createdAt: createdYesterday,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        ...MOCK_CASE,
        createdAt: createdToday,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
    ];
    applicationContext
      .getUseCaseHelpers()
      .processUserAssociatedCases.mockReturnValue({
        casesAssociatedWithUserOrLeadCaseMap: mockFoundCasesList,
        leadDocketNumbersAssociatedWithUser: [],
      });

    const { openCaseList } = await getCasesForUserInteractor(
      applicationContext,
    );

    expect(openCaseList).toMatchObject([
      {
        createdAt: createdToday,
      },
      {
        createdAt: createdYesterday,
      },
    ]);
  });

  it('should return a list of closed cases sorted by closedDate descending', async () => {
    const closedToday = applicationContext.getUtilities().createISODateString();
    const closedYesterday = applicationContext
      .getUtilities()
      .calculateISODate({ dateString: closedToday, howMuch: -1 });
    mockFoundCasesList = [
      {
        ...MOCK_CASE,
        closedDate: closedYesterday,
        status: CASE_STATUS_TYPES.closed,
      },
      {
        ...MOCK_CASE,
        closedDate: closedToday,
        status: CASE_STATUS_TYPES.closed,
      },
    ];

    const { closedCaseList } = await getCasesForUserInteractor(
      applicationContext,
    );

    expect(closedCaseList).toMatchObject([
      {
        closedDate: closedToday,
      },
      {
        closedDate: closedYesterday,
      },
    ]);
  });

  it('should return a list of open cases when the user is associated with a consolidated case that is not the lead case', async () => {
    const consolidatedCaseThatIsNotTheLeadCase = {
      ...MOCK_CASE,
      docketNumber: '999-20',
      isLeadCase: false,
    };
    const mockUserAssociatedDocketNumbersMap = {};
    mockUserAssociatedDocketNumbersMap[
      consolidatedCaseThatIsNotTheLeadCase.docketNumber
    ] = true;
    applicationContext
      .getUseCaseHelpers()
      .processUserAssociatedCases.mockReturnValue({
        casesAssociatedWithUserOrLeadCaseMap: {},
        leadDocketNumbersAssociatedWithUser: [
          consolidatedCaseThatIsNotTheLeadCase.docketNumber,
        ],
        userAssociatedDocketNumbersMap: mockUserAssociatedDocketNumbersMap,
      });
    applicationContext
      .getUseCaseHelpers()
      .getUnassociatedLeadCase.mockReturnValue(MOCK_CASE);
    applicationContext
      .getUseCaseHelpers()
      .formatAndSortConsolidatedCases.mockReturnValue([
        consolidatedCaseThatIsNotTheLeadCase,
      ]);

    const { openCaseList } = await getCasesForUserInteractor(
      applicationContext,
    );

    expect(openCaseList[0]).toBe(MOCK_CASE);
    expect(openCaseList[0].consolidatedCases[0]).toBe(
      consolidatedCaseThatIsNotTheLeadCase,
    );
  });
});

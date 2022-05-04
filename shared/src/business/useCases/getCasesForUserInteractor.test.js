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

  it('should make a call to retrieve open cases by user', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      statuses: applicationContext.getConstants().OPEN_CASE_STATUSES,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should validate the list of found open cases', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(UserCase.validateRawCollection).toBeCalled();
  });

  it('should return a list of open cases', async () => {
    const { openCaseList } = await getCasesForUserInteractor(
      applicationContext,
    );

    expect(openCaseList).toMatchObject([
      {
        caseCaption: MOCK_CASE.caseCaption,
        docketNumber: MOCK_CASE.docketNumber,
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
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

describe('closed case stuff for now', () => {
  let mockFoundCasesList;
  const recentClosedDate = applicationContext
    .getUtilities()
    .createISODateString();
  const pastClosedDate = applicationContext
    .getUtilities()
    .calculateISODate({ dateString: recentClosedDate, howMuch: -1 });

  beforeEach(() => {
    mockFoundCasesList = [
      {
        ...MOCK_CASE,
        closedDate: pastClosedDate,
        status: CASE_STATUS_TYPES.closed,
      },
      {
        ...MOCK_CASE,
        closedDate: recentClosedDate,
        status: CASE_STATUS_TYPES.closed,
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      );
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockImplementation(() => mockFoundCasesList);
    UserCase.validateRawCollection.mockImplementation(
      foundCases => foundCases || [],
    );
  });

  it('should make a call to retrieve closed cases by user', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should validate the found closed cases', async () => {
    await getCasesForUserInteractor(applicationContext);

    expect(UserCase.validateRawCollection).toBeCalled();
  });

  it('should return a list of closed cases sorted by closedDate descending', async () => {
    MOCK_CASE.status = 'Closed';

    const { closedCaseList } = await getCasesForUserInteractor(
      applicationContext,
    );

    expect(closedCaseList).toMatchObject([
      {
        caseCaption: MOCK_CASE.caseCaption,
        closedDate: recentClosedDate,
        docketNumber: MOCK_CASE.docketNumber,
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      },
      {
        closedDate: pastClosedDate,
        docketNumber: MOCK_CASE.docketNumber,
      },
    ]);
  });
});

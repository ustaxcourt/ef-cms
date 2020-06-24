const {
  getOpenConsolidatedCasesInteractor,
} = require('./getOpenConsolidatedCasesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
jest.mock('../entities/UserCase');
const { UserCase } = require('../entities/UserCase');

describe('getOpenConsolidatedCasesInteractor', () => {
  let mockFoundCasesList;

  beforeEach(() => {
    mockFoundCasesList = [MOCK_CASE];

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
      .getIndexedCasesForUser.mockImplementation(() => mockFoundCasesList);
    applicationContext
      .getUseCaseHelpers()
      .processUserAssociatedCases.mockReturnValue({
        casesAssociatedWithUserOrLeadCaseMap: {
          'c54ba5a9-b37b-479d-9201-067ec6e335bb': MOCK_CASE,
        },
        leadCaseIdsAssociatedWithUser: [MOCK_CASE.caseId],
        userAssociatedCaseIdsMap: {},
      });
    applicationContext
      .getUseCaseHelpers()
      .getConsolidatedCasesForLeadCase.mockReturnValue([]);
    UserCase.validateRawCollection.mockImplementation(foundCases => foundCases);
  });

  it('should retrieve the current user information', async () => {
    await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(applicationContext.getCurrentUser).toBeCalled();
  });

  it('should make a call to retrieve open cases by user', async () => {
    await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getIndexedCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      statuses: applicationContext.getConstants().OPEN_CASE_STATUSES,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should validate the list of found open cases', async () => {
    await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(UserCase.validateRawCollection).toBeCalled();
  });

  it('should return an empty list when no open cases are found', async () => {
    mockFoundCasesList = [];

    const result = await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(result).toEqual([]);
  });

  it('should return a list of open cases', async () => {
    const result = await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(result).toMatchObject([
      {
        caseCaption: MOCK_CASE.caseCaption,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      },
    ]);
  });

  it('should return a list of open cases when the user is associated with a consolidated case that is not the lead case', async () => {
    const consolidatedCaseThatIsNotTheLeadCase = {
      ...MOCK_CASE,
      caseId: applicationContext.getUniqueId(),
      isLeadCase: false,
    };
    const mockUserAssociatedCaseIdsMap = {};
    mockUserAssociatedCaseIdsMap[
      consolidatedCaseThatIsNotTheLeadCase.caseId
    ] = true;
    applicationContext
      .getUseCaseHelpers()
      .processUserAssociatedCases.mockReturnValue({
        casesAssociatedWithUserOrLeadCaseMap: {},
        leadCaseIdsAssociatedWithUser: [
          consolidatedCaseThatIsNotTheLeadCase.caseId,
        ],
        userAssociatedCaseIdsMap: mockUserAssociatedCaseIdsMap,
      });
    applicationContext
      .getUseCaseHelpers()
      .getUnassociatedLeadCase.mockReturnValue(MOCK_CASE);
    applicationContext
      .getUseCaseHelpers()
      .formatAndSortConsolidatedCases.mockReturnValue([
        consolidatedCaseThatIsNotTheLeadCase,
      ]);

    const result = await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(result[0]).toBe(MOCK_CASE);
    expect(result[0].consolidatedCases[0]).toBe(
      consolidatedCaseThatIsNotTheLeadCase,
    );
  });
});

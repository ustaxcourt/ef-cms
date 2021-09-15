const { applicationContext } = require('../test/createTestApplicationContext');
const { getClosedCasesInteractor } = require('./getClosedCasesInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
jest.mock('../entities/UserCase');
const { UserCase } = require('../entities/UserCase');

describe('getClosedCasesInteractor', () => {
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
      .getCasesForUser.mockImplementation(() => mockFoundCasesList);
    UserCase.validateRawCollection.mockImplementation(
      foundCases => foundCases || [],
    );
  });

  it('should retrieve the current user information', async () => {
    await getClosedCasesInteractor(applicationContext);

    expect(applicationContext.getCurrentUser).toBeCalled();
  });

  it('should make a call to retrieve closed cases by user', async () => {
    await getClosedCasesInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should return an empty list when no closed cases are found', async () => {
    mockFoundCasesList = [];

    const result = await getClosedCasesInteractor(applicationContext);

    expect(result).toEqual([]);
  });

  it('should validate the found closed cases', async () => {
    await getClosedCasesInteractor(applicationContext);

    expect(UserCase.validateRawCollection).toBeCalled();
  });

  it('should return a list of closed cases', async () => {
    MOCK_CASE.status = 'Closed';
    const result = await getClosedCasesInteractor(applicationContext);

    expect(result).toMatchObject([
      {
        caseCaption: MOCK_CASE.caseCaption,
        docketNumber: MOCK_CASE.docketNumber,
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      },
    ]);
  });
});

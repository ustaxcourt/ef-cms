const { applicationContext } = require('../test/createTestApplicationContext');
const { getOpenCasesInteractor } = require('./getOpenCasesInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('getOpenCasesInteractor', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = [MOCK_CASE];

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
      .getOpenCasesByUser.mockImplementation(() => mockCase);
  });

  it('should retrieve the current user information', async () => {
    await getOpenCasesInteractor({
      applicationContext,
    });

    expect(applicationContext.getCurrentUser).toBeCalled();
  });

  it('should make a call to retrieve open cases by user', async () => {
    await getOpenCasesInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getOpenCasesByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should return an empty list when no open cases are found', async () => {
    mockCase = null;

    const result = await getOpenCasesInteractor({
      applicationContext,
    });

    expect(result).toEqual([]);
  });

  it('should return a list of open cases', async () => {
    const result = await getOpenCasesInteractor({
      applicationContext,
    });

    expect(result).toMatchObject([
      {
        caseCaption: MOCK_CASE.caseCaption,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
        leadCaseId: MOCK_CASE.leadCaseId,
      },
    ]);
  });
});

const {
  getOpenConsolidatedCasesInteractor,
  processUserAssociatedCases,
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
      .getOpenCasesByUser.mockImplementation(() => mockFoundCasesList);
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
      applicationContext.getPersistenceGateway().getOpenCasesByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
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

  describe('processUserAssociatedCases', () => {
    it('should set isRequestingUserAssociated to true for each case', async () => {
      processUserAssociatedCases(mockFoundCasesList);

      expect(MOCK_CASE.isRequestingUserAssociated).toBe(true);
    });

    it('should add a case to casesAssociatedWithUserOrLeadCaseMap when it is a lead case', async () => {
      mockFoundCasesList = [{ ...MOCK_CASE, isLeadCase: true }];

      const result = processUserAssociatedCases(mockFoundCasesList);

      expect(
        result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
      ).toEqual({ ...MOCK_CASE, isLeadCase: true });
    });

    it('should add a case to casesAssociatedWithUserOrLeadCaseMap when it does not have a leadCaseId', async () => {
      mockFoundCasesList = [MOCK_CASE];
      const result = processUserAssociatedCases(mockFoundCasesList);

      expect(
        result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
      ).toEqual(MOCK_CASE);
    });

    it("should add a case's caseId to userAssociatedCaseIdsMap", async () => {
      mockFoundCasesList = [MOCK_CASE];
      const result = processUserAssociatedCases(mockFoundCasesList);

      expect(result.userAssociatedCaseIdsMap[MOCK_CASE.caseId]).toEqual(true);
    });

    it('should add a case to leadCaseIdsAssociatedWithUser if it has a leadCaseId and is not associated with the user', async () => {
      let mockCaseWithLeadCaseId = {
        ...MOCK_CASE,
        leadCaseId: applicationContext.getUniqueId(),
      };
      mockFoundCasesList = [mockCaseWithLeadCaseId];

      const result = processUserAssociatedCases(mockFoundCasesList);

      expect(
        result.leadCaseIdsAssociatedWithUser.includes(
          mockCaseWithLeadCaseId.leadCaseId.toString(),
        ),
      ).toBe(true);
    });

    it('should populate casesAssociatedWithUserOrLeadCaseMap, leadCaseIdsAssociatedWithUser and userAssociatedCaseIdsMap', async () => {
      let mockCaseWithLeadCaseId = {
        ...MOCK_CASE,
        isLeadCase: true,
        leadCaseId: applicationContext.getUniqueId(),
      };
      mockFoundCasesList = [mockCaseWithLeadCaseId, MOCK_CASE];

      const result = processUserAssociatedCases(mockFoundCasesList);

      expect(result.casesAssociatedWithUserOrLeadCaseMap).not.toBe({});
      expect(result.leadCaseIdsAssociatedWithUser.length).toBe(1);
      expect(result.userAssociatedCaseIdsMap).not.toBe({});
    });
  });
});

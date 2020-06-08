const {
  getConsolidatedCasesForLeadCase,
  getOpenConsolidatedCasesInteractor,
  processUserAssociatedCases,
  setUnassociatedLeadCase,
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

  describe('setUnassociatedLeadCase', () => {
    it('should set the found case isRequestingUserAssociated to false', () => {
      let casesAssociatedWithUserOrLeadCaseMap = {};

      setUnassociatedLeadCase({
        casesAssociatedWithUserOrLeadCaseMap,
        consolidatedCases: [MOCK_CASE],
        leadCaseId: MOCK_CASE.caseId,
      });

      expect(
        casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId]
          .isRequestingUserAssociated,
      ).toBe(false);
    });

    it('should search for the lead case and add it to the casesAssociatedWithUserOrLeadCaseMap', () => {
      let casesAssociatedWithUserOrLeadCaseMap = {};

      setUnassociatedLeadCase({
        casesAssociatedWithUserOrLeadCaseMap,
        consolidatedCases: [MOCK_CASE],
        leadCaseId: MOCK_CASE.caseId,
      });

      expect(
        casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
      ).toMatchObject(MOCK_CASE);
    });
  });

  describe('getConsolidatedCasesForLeadCase', () => {
    it('should retrieve all cases associated with the leadCaseId', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId.mockReturnValue([MOCK_CASE]);

      await getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap: {
          '123': MOCK_CASE,
        },
        leadCaseId: '123',
        userAssociatedCaseIdsMap: {},
      });

      expect(
        applicationContext.getPersistenceGateway().getCasesByLeadCaseId.mock
          .calls[0][0],
      ).toMatchObject({ leadCaseId: '123' });
    });

    // TODO - Refactor Case constants into their own file.
    //  Test currently fails when trying to mock out Case.validateRawCollection
    //  due to circular dependency issue, UserCase pulls in Case validation text
    // it('should validate the retrieved cases', async () => {
    //   const mockCaseId = '123';
    //   applicationContext
    //     .getPersistenceGateway()
    //     .getCasesByLeadCaseId.mockResolvedValue([MOCK_CASE]);

    //   getConsolidatedCasesForLeadCase({
    //     applicationContext,
    //     casesAssociatedWithUserOrLeadCaseMap: {
    //       '123': MOCK_CASE,
    //     },
    //     leadCaseId: mockCaseId,
    //     userAssociatedCaseIdsMap: {},
    //   });

    //   expect(Case.validateRawCollection).toBeCalled();
    // });

    it('should retrieve the lead case when it is not associated with the current user', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId.mockReturnValue([
          { ...MOCK_CASE, leadCaseId: MOCK_CASE.caseId },
        ]);
      let casesAssociatedWithUserOrLeadCaseMap = {};

      await getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap,
        leadCaseId: MOCK_CASE.caseId,
        userAssociatedCaseIdsMap: {},
      });

      expect(
        casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
      ).toBeDefined();
    });

    it('should set isRequestingUserAssociated for each case associated with the specified lead caseId', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId.mockReturnValue([MOCK_CASE]);

      const result = await getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap: {
          '123': {},
        },
        leadCaseId: '123',
        userAssociatedCaseIdsMap: {
          'c54ba5a9-b37b-479d-9201-067ec6e335bb': true,
        },
      });

      expect(result[0].caseId).toBe(MOCK_CASE.caseId);
      expect(result[0].isRequestingUserAssociated).toBe(true);
    });

    it("should add each case to the consolidatedCases list for the specified lead caseId when it's not the lead case", async () => {
      const mockLeadCaseId = applicationContext.getUniqueId();
      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId.mockReturnValue([
          MOCK_CASE,
          { ...MOCK_CASE, caseId: mockLeadCaseId, leadCaseId: mockLeadCaseId },
        ]);

      const result = await getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap: {
          mockLeadCaseId: {},
        },
        leadCaseId: mockLeadCaseId,
        userAssociatedCaseIdsMap: {
          mockLeadCaseId: true,
        },
      });

      expect(result.length).toBe(1);
      expect(result[0].caseId).toBe(MOCK_CASE.caseId);
    });

    it('should return the list of consolidatedCases sorted by docketNumber', async () => {
      const mockOtherCaseId = applicationContext.getUniqueId();
      const mockOtherCaseDocketNumber = '999-99';
      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId.mockReturnValue([
          MOCK_CASE,
          {
            ...MOCK_CASE,
            caseId: mockOtherCaseId,
            docketNumber: mockOtherCaseDocketNumber,
          },
        ]);

      const result = await getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap: {
          '123': {},
        },
        leadCaseId: '123',
        userAssociatedCaseIdsMap: {
          '123': true,
        },
      });

      expect(result.length).toBe(2);
      expect(result[0].docketNumber).toBe(MOCK_CASE.docketNumber);
      expect(result[1].docketNumber).toBe(mockOtherCaseDocketNumber);
    });
  });
});

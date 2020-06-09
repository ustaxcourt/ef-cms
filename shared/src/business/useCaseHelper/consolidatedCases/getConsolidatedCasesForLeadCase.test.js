const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getConsolidatedCasesForLeadCase,
} = require('./getConsolidatedCasesForLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

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

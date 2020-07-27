const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { processUserAssociatedCases } = require('./processUserAssociatedCases');

describe('processUserAssociatedCases', () => {
  let mockFoundCasesList;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  beforeEach(() => {
    mockFoundCasesList = [MOCK_CASE];
  });

  it('should set isRequestingUserAssociated to true for each case', async () => {
    await processUserAssociatedCases({
      applicationContext,
      openUserCases: mockFoundCasesList,
    });

    expect(MOCK_CASE.isRequestingUserAssociated).toBe(true);
  });

  it('should add a case to casesAssociatedWithUserOrLeadCaseMap when it is a lead case', async () => {
    mockFoundCasesList = [{ ...MOCK_CASE, isLeadCase: true }];

    const result = await processUserAssociatedCases({
      applicationContext,
      openUserCases: mockFoundCasesList,
    });

    expect(
      result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
    ).toEqual({ ...MOCK_CASE, isLeadCase: true });
  });

  it('should add a case to casesAssociatedWithUserOrLeadCaseMap when it does not have a leadCaseId', async () => {
    const result = await processUserAssociatedCases({
      applicationContext,
      openUserCases: mockFoundCasesList,
    });

    expect(
      result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
    ).toEqual(MOCK_CASE);
  });

  it("should add a case's caseId to userAssociatedCaseIdsMap", async () => {
    const result = await processUserAssociatedCases({
      applicationContext,
      openUserCases: mockFoundCasesList,
    });

    expect(result.userAssociatedCaseIdsMap[MOCK_CASE.caseId]).toEqual(true);
  });

  it('should add a case to leadCaseIdsAssociatedWithUser if it has a leadCaseId and is not associated with the user', async () => {
    let mockCaseWithLeadCaseId = {
      ...MOCK_CASE,
      leadCaseId: applicationContext.getUniqueId(),
    };
    mockFoundCasesList = [mockCaseWithLeadCaseId];

    const result = await processUserAssociatedCases({
      applicationContext,
      openUserCases: mockFoundCasesList,
    });

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

    const result = await processUserAssociatedCases({
      applicationContext,
      openUserCases: mockFoundCasesList,
    });

    expect(result.casesAssociatedWithUserOrLeadCaseMap).not.toBe({});
    expect(result.leadCaseIdsAssociatedWithUser.length).toBe(1);
    expect(result.userAssociatedCaseIdsMap).not.toBe({});
  });
});

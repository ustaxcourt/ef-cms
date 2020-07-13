const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { processUserAssociatedCases } = require('./processUserAssociatedCases');

describe('processUserAssociatedCases', () => {
  let mockFoundCasesList;

  beforeEach(() => {
    mockFoundCasesList = [MOCK_CASE];
  });

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
    const result = processUserAssociatedCases(mockFoundCasesList);

    expect(
      result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
    ).toEqual(MOCK_CASE);
  });

  it("should add a case's caseId to userAssociatedCaseIdsMap", async () => {
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

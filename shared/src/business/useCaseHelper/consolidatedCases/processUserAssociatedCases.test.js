const { MOCK_CASE } = require('../../../test/mockCase');
const { processUserAssociatedCases } = require('./processUserAssociatedCases');

describe('processUserAssociatedCases', () => {
  let mockFoundCasesList;

  beforeEach(() => {
    mockFoundCasesList = [MOCK_CASE];
  });

  it('should set isRequestingUserAssociated to true for each case', () => {
    processUserAssociatedCases(mockFoundCasesList);

    expect(MOCK_CASE.isRequestingUserAssociated).toBe(true);
  });

  it('should add a case to casesAssociatedWithUserOrLeadCaseMap when it is a lead case', () => {
    mockFoundCasesList = [{ ...MOCK_CASE, isLeadCase: true }];

    const result = processUserAssociatedCases(mockFoundCasesList);

    expect(
      result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.docketNumber],
    ).toEqual({ ...MOCK_CASE, isLeadCase: true });
  });

  it('should add a case to casesAssociatedWithUserOrLeadCaseMap when it does not have a leadDocketNumber', () => {
    const result = processUserAssociatedCases(mockFoundCasesList);

    expect(
      result.casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.docketNumber],
    ).toEqual(MOCK_CASE);
  });

  it("should add a case's docketNumber to userAssociatedDocketNumbersMap", () => {
    const result = processUserAssociatedCases(mockFoundCasesList);

    expect(
      result.userAssociatedDocketNumbersMap[MOCK_CASE.docketNumber],
    ).toEqual(true);
  });

  it('should add a case to leadDocketNumbersAssociatedWithUser if it has a leadDocketNumber and is not associated with the user', () => {
    let mockCaseWithLeadDocketNumber = {
      ...MOCK_CASE,
      leadDocketNumber: '101-20',
    };
    mockFoundCasesList = [mockCaseWithLeadDocketNumber];

    const result = processUserAssociatedCases(mockFoundCasesList);

    expect(
      result.leadDocketNumbersAssociatedWithUser.includes(
        mockCaseWithLeadDocketNumber.leadDocketNumber.toString(),
      ),
    ).toBe(true);
  });

  it('should populate casesAssociatedWithUserOrLeadCaseMap, leadDocketNumbersAssociatedWithUser and userAssociatedDocketNumbersMap', () => {
    let mockCaseWithLeadDocketNumber = {
      ...MOCK_CASE,
      isLeadCase: true,
      leadDocketNumber: '101-20',
    };
    mockFoundCasesList = [mockCaseWithLeadDocketNumber, MOCK_CASE];

    const result = processUserAssociatedCases(mockFoundCasesList);

    expect(result.casesAssociatedWithUserOrLeadCaseMap).not.toBe({});
    expect(result.leadDocketNumbersAssociatedWithUser.length).toBe(1);
    expect(result.userAssociatedDocketNumbersMap).not.toBe({});
  });
});

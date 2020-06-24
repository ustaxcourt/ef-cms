const { getUnassociatedLeadCase } = require('./getUnassociatedLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getUnassociatedLeadCase', () => {
  it('should set the found case isRequestingUserAssociated to false', () => {
    const result = getUnassociatedLeadCase({
      consolidatedCases: [MOCK_CASE],
      leadCaseId: MOCK_CASE.caseId,
    });

    expect(result.isRequestingUserAssociated).toBe(false);
  });

  it('should return the found lead case', () => {
    let casesAssociatedWithUserOrLeadCaseMap = {};

    const result = getUnassociatedLeadCase({
      casesAssociatedWithUserOrLeadCaseMap,
      consolidatedCases: [MOCK_CASE],
      leadCaseId: MOCK_CASE.caseId,
    });

    expect(result).toMatchObject(MOCK_CASE);
  });
});

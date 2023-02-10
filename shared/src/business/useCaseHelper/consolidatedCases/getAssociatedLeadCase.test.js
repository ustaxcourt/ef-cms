const { getAssociatedLeadCase } = require('./getAssociatedLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAssociatedLeadCase', () => {
  it('should set the found case isRequestingUserAssociated to false', () => {
    const result = getAssociatedLeadCase({
      consolidatedCases: [MOCK_CASE],
      leadDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.isRequestingUserAssociated).toBe(true);
  });

  it('should return the found lead case', () => {
    let casesAssociatedWithUserOrLeadCaseMap = {};

    const result = getAssociatedLeadCase({
      casesAssociatedWithUserOrLeadCaseMap,
      consolidatedCases: [MOCK_CASE],
      leadDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toMatchObject(MOCK_CASE);
  });
});

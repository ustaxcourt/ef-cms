const { getAssociatedLeadCase } = require('./getUnassociatedLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAssociatedLeadCase', () => {
  it('should set the found case isRequestingUserAssociated to false', () => {
    const result = getAssociatedLeadCase({
      consolidatedCases: [MOCK_CASE],
      leadDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.isRequestingUserAssociated).toBe(false);
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

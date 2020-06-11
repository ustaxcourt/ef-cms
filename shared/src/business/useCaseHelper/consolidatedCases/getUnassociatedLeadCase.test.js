const { getUnassociatedLeadCase } = require('./getUnassociatedLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getUnassociatedLeadCase', () => {
  it('should set the found case isRequestingUserAssociated to false', () => {
    let casesAssociatedWithUserOrLeadCaseMap = {};

    getUnassociatedLeadCase({
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

    getUnassociatedLeadCase({
      casesAssociatedWithUserOrLeadCaseMap,
      consolidatedCases: [MOCK_CASE],
      leadCaseId: MOCK_CASE.caseId,
    });

    expect(
      casesAssociatedWithUserOrLeadCaseMap[MOCK_CASE.caseId],
    ).toMatchObject(MOCK_CASE);
  });
});

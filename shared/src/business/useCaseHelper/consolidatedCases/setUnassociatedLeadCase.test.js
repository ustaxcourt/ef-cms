const { MOCK_CASE } = require('../../../test/mockCase');
const { setUnassociatedLeadCase } = require('./setUnassociatedLeadCase');

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

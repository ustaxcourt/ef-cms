export const petitionerVerifiesConsolidatedCases = test => {
  return it('Petitioner verifies there are consolidated cases', async () => {
    const cases = test.getState('openCases');

    const casesWithConsolidation = cases.filter(
      caseDetail => !!caseDetail.leadDocketNumber,
    );
    expect(casesWithConsolidation.length).toBeGreaterThan(0);

    const aLeadCase = casesWithConsolidation.find(
      caseDetail =>
        caseDetail.leadDocketNumber ===
        casesWithConsolidation[0].leadDocketNumber,
    );
    expect(aLeadCase.consolidatedCases.length).toBeGreaterThan(0);
  });
};

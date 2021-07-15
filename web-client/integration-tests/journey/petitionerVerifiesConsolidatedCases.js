export const petitionerVerifiesConsolidatedCases = cerebralTest => {
  return it('Petitioner verifies there are consolidated cases', () => {
    const cases = cerebralTest.getState('openCases');

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

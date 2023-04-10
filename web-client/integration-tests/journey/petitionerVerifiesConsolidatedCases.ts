export const petitionerVerifiesConsolidatedCases = (
  cerebralTest,
  expectedNumberOfConsolidatedCases,
) => {
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
    // The dashboard excludes the lead case from consolidatedCases
    const dashboardViewConsolidatedCases =
      expectedNumberOfConsolidatedCases - 1;
    expect(aLeadCase.consolidatedCases.length).toEqual(
      dashboardViewConsolidatedCases,
    );

    cerebralTest.docketNumber = aLeadCase.docketNumber;
    cerebralTest.leadDocketNumber = aLeadCase.docketNumber;
  });
};

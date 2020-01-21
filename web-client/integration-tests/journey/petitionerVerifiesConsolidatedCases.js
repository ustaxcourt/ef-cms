export default test => {
  return it('Petitioner verifies there are consolidated cases', async () => {
    const cases = test.getState('cases');

    const casesWithConsolidation = cases.filter(
      caseDetail => !!caseDetail.leadCaseId,
    );
    expect(casesWithConsolidation.length).toBeGreaterThan(0);

    const aLeadCase = casesWithConsolidation.find(
      caseDetail =>
        caseDetail.leadCaseId === casesWithConsolidation[0].leadCaseId,
    );
    expect(aLeadCase.consolidatedCases.length).toBeGreaterThan(0);
  });
};

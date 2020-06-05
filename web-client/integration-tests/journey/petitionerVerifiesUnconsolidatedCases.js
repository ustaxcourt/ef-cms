export const petitionerVerifiesUnconsolidatedCases = test => {
  return it('Petitioner verifies the cases were unconsolidated', async () => {
    const cases = test.getState('openCases');

    const casesWithConsolidation = cases.filter(
      caseDetail => caseDetail.leadCaseId === test.leadCaseId,
    );
    expect(casesWithConsolidation.length).toEqual(0);
  });
};

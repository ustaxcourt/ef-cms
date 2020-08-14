export const petitionerVerifiesUnconsolidatedCases = test => {
  return it('Petitioner verifies the cases were unconsolidated', async () => {
    const cases = test.getState('openCases');

    const casesWithConsolidation = cases.filter(
      caseDetail => caseDetail.leadDocketNumber === test.leadDocketNumber,
    );
    expect(casesWithConsolidation.length).toEqual(0);
  });
};

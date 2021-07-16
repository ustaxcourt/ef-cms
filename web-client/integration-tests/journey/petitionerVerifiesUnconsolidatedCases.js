export const petitionerVerifiesUnconsolidatedCases = cerebralTest => {
  return it('Petitioner verifies the cases were unconsolidated', () => {
    const cases = cerebralTest.getState('openCases');

    const casesWithConsolidation = cases.filter(
      caseDetail =>
        caseDetail.leadDocketNumber === cerebralTest.leadDocketNumber,
    );
    expect(casesWithConsolidation.length).toEqual(0);
  });
};

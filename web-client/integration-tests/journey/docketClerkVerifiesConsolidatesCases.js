export const docketClerkVerifiesConsolidatesCases = cerebralTest => {
  return it('Docket clerk verifies consolidates cases', () => {
    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
  });
};

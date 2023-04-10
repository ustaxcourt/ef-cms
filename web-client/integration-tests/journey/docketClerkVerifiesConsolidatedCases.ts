export const docketClerkVerifiesConsolidatedCases = cerebralTest => {
  return it('Docket clerk verifies consolidates cases', () => {
    const expectedDocketNumber = cerebralTest.leadDocketNumber;
    const caseDetail = cerebralTest.getState('caseDetail');

    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
    expect(caseDetail.leadDocketNumber).toBeDefined();
    expect(caseDetail.leadDocketNumber).toEqual(expectedDocketNumber);
  });
};

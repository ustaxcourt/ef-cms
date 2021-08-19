export const docketClerkConsolidatesCases = cerebralTest => {
  return it('Docket clerk consolidates cases', async () => {
    cerebralTest.setState('modal.confirmSelection', true);
    await cerebralTest.runSequence('submitAddConsolidatedCaseSequence');

    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
  });
};

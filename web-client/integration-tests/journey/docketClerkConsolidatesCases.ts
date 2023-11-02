export const docketClerkConsolidatesCases = (
  cerebralTest,
  expectedNumberOfConsolidatedCases,
) => {
  return it('Docket clerk consolidates cases', async () => {
    cerebralTest.setState('modal.confirmSelection', true);
    await cerebralTest.runSequence('submitAddConsolidatedCaseSequence');

    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(expectedNumberOfConsolidatedCases);
    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: 'Selected cases consolidated.',
    });
    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
  });
};

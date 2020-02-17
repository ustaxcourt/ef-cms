export default test => {
  return it('Docket clerk consolidates cases', async () => {
    test.setState('modal.confirmSelection', true);
    await test.runSequence('submitAddConsolidatedCaseSequence');

    expect(test.getState('caseDetail')).toHaveProperty('consolidatedCases');
    expect(test.getState('caseDetail.consolidatedCases').length).toEqual(2);
  });
};

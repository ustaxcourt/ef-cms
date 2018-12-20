export default test => {
  return it('Petitions clerk searches for case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: test.docketNumber,
    });
    await test.runSequence('submitSearchSequence');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
  });
};

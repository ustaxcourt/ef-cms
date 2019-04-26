export default test => {
  return it('Practitioner searches for case', async () => {
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('form.searchError')).toEqual(true);

    await test.runSequence('updateSearchTermSequence', {
      searchTerm: test.docketNumber,
    });
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('form.searchError')).toEqual(false);
  });
};

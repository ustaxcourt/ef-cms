export default test => {
  return it('unassociated user performs an advanced search by name for a sealed case', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda after creating the case
    await new Promise(resolve => setTimeout(resolve, 3000));

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'petitionerName',
      value: 'NOTAREALNAMEFORTESTING',
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(
      test
        .getState('searchResults')
        .find(result => result.docketNumber === test.docketNumber),
    ).toBeUndefined();
  });
};

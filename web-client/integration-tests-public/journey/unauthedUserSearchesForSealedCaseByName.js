export default test => {
  return it('Search for sealed case by name', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda after creating and updating the case
    await new Promise(resolve => setTimeout(resolve, 3000));

    const queryParams = {
      petitionerName: 'NOTAREALNAMEFORTESTINGPUBLIC',
    };

    test.setState('advancedSearchForm', queryParams);

    await test.runSequence('submitPublicAdvancedSearchSequence', {});

    const searchResults = test.getState('searchResults');
    expect(searchResults.length).toEqual(0);
  });
};

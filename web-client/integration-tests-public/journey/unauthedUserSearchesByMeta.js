export default (test, overrides = {}) => {
  return it('Search for cases by meta data', async () => {
    const queryParams = {
      countryType: 'domestic',
      currentPage: 1,
      petitionerName: 'Test Person',
      ...overrides,
    };

    test.setState('advancedSearchForm', queryParams);

    await test.runSequence('submitPublicAdvancedSearchSequence', {});

    const searchResults = test.getState('searchResults');
    expect(searchResults.length).toBeGreaterThan(0);

    await test.runSequence('clearAdvancedSearchFormSequence');
    expect(test.getState('searchResults')).toBeUndefined();
    expect(test.getState('advancedSearchForm')).toEqual({
      countryType: 'domestic',
      currentPage: 1,
    });
  });
};

export default (test, overrides = {}) => {
  return it('Search for cases by meta data', async () => {
    const queryParams = {
      countryType: 'domestic',
      currentPage: 1,
      petitionerName:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
      ...overrides,
    };

    test.setState('advancedSearchForm.caseSearchByName', queryParams);

    await test.runSequence('submitPublicAdvancedSearchSequence', {});

    const searchResults = test.getState('searchResults');
    expect(searchResults.length).toBeGreaterThan(0);

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByName',
    });
    expect(test.getState('searchResults')).toBeUndefined();
    expect(test.getState('advancedSearchForm')).toEqual({
      caseSearchByName: { countryType: 'domestic' },
      currentPage: 1,
    });
  });
};

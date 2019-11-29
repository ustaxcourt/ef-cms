export default (test, overrides = {}) => {
  return it('Search for cases by meta data', async () => {
    const queryParams = Object.apply(
      {
        countryType: 'domestic',
        currentPage: 1,
        petitionerName: 'Test Person',
      },
      overrides,
    );

    test.setState('advancedSearchForm', queryParams);

    const result = await test.runSequence(
      'submitPublicAdvancedSearchSequence',
      {},
    );
    //console.log(result);
  });
};

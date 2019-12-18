export default (test, params) => {
  return it('Search for cases by docket number', async () => {
    let searchResults;
    const queryParams = {
      docketNumber: params.docketNumber,
    };

    test.setState('docketNumberSearchForm', { docketNumber: '123-xx' });
    await test.runSequence('submitCaseDocketNumberSearchSequence', {});
    searchResults = test.getState('searchResults');
    expect(searchResults).toEqual([]);
    expect(test.currentRouteUrl.indexOf('/case-detail')).toEqual(-1);

    await test.runSequence('clearDocketNumberSearchFormSequence');
    expect(test.getState('searchResults')).toBeUndefined();
    expect(test.getState('docketNumberSearchForm')).toEqual({});

    test.setState('docketNumberSearchForm', queryParams);
    await test.runSequence('submitCaseDocketNumberSearchSequence', {});
    searchResults = test.getState('searchResults');
    expect(test.getState('caseId')).toEqual(params.docketNumber);
    expect(test.currentRouteUrl.indexOf('/case-detail')).toEqual(0);
  });
};

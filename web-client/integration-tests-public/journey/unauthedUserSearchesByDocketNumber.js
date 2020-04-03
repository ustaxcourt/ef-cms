export default (test, params) => {
  return it('Search for cases by docket number', async () => {
    let searchResults;
    const queryParams = {
      docketNumber: params.docketNumber,
    };
    test.docketNumber = params.docketNumber;

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: '123-xx',
    });
    await test.runSequence('submitCaseDocketNumberSearchSequence', {});
    searchResults = test.getState('searchResults');
    expect(searchResults).toEqual([]);
    expect(test.currentRouteUrl.indexOf('/case-detail')).toEqual(-1);

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByDocketNumber',
    });
    expect(test.getState('searchResults')).toBeUndefined();
    expect(
      test.getState('advancedSearchForm.caseSearchByDocketNumber'),
    ).toEqual({});

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: queryParams.docketNumber,
    });
    await test.runSequence('submitCaseDocketNumberSearchSequence', {});
    searchResults = test.getState('searchResults');
    expect(test.getState('caseId')).toEqual(params.docketNumber);
    expect(test.currentRouteUrl.indexOf('/case-detail')).toEqual(0);
  });
};

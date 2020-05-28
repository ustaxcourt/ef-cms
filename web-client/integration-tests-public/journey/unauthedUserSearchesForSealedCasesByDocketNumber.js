export const unauthedUserSearchesForSealedCasesByDocketNumber = test => {
  return it('Search for a sealed case by docket number', async () => {
    let searchResults;
    const queryParams = {
      docketNumber: '105-20',
    };
    test.docketNumber = queryParams.docketNumber;

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: '123-xx',
    });
    await test.runSequence('submitPublicCaseDocketNumberSearchSequence', {});
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
    await test.runSequence('submitPublicCaseDocketNumberSearchSequence', {});
    expect(test.getState('searchResults')).toEqual([]);
    expect(test.currentRouteUrl.indexOf('/case-detail')).toEqual(-1);
  });
};

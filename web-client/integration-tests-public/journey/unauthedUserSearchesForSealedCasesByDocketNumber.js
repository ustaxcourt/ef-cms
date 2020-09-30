export const unauthedUserSearchesForSealedCasesByDocketNumber = test => {
  return it('Search for a sealed case by docket number', async () => {
    test.currentRouteUrl = '';
    test.setState('caseSearchByDocketNumber', {});

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: test.docketNumber,
    });

    await test.runSequence('submitPublicCaseDocketNumberSearchSequence');

    expect(test.getState('searchResults')).toEqual([]);
    expect(test.currentRouteUrl).toBe(`/case-detail/${test.docketNumber}`);
  });
};

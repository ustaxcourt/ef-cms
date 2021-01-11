import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unauthedUserSearchesByDocketNumber = (test, params) => {
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
    await test.runSequence('submitPublicCaseDocketNumberSearchSequence', {});
    searchResults = test.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`);
    expect(searchResults).toEqual([]);
    expect(test.currentRouteUrl.indexOf('/case-detail')).toEqual(-1);

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByDocketNumber',
    });
    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
    ).toBeUndefined();
    expect(
      test.getState('advancedSearchForm.caseSearchByDocketNumber'),
    ).toEqual({});

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: queryParams.docketNumber,
    });
    await test.runSequence('submitPublicCaseDocketNumberSearchSequence', {});
    searchResults = test.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`);
    expect(
      test.currentRouteUrl.indexOf(`/case-detail/${params.docketNumber}`),
    ).toEqual(0);
  });
};

import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unauthedUserSearchesByDocketNumber = (cerebralTest, params) => {
  return it('Search for cases by docket number', async () => {
    let searchResults;
    const queryParams = {
      docketNumber: params.docketNumber,
    };
    cerebralTest.docketNumber = params.docketNumber;

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: '123-xx',
    });
    await cerebralTest.runSequence(
      'submitPublicCaseDocketNumberSearchSequence',
      {},
    );
    searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(searchResults).toEqual([]);
    expect(cerebralTest.currentRouteUrl.indexOf('/case-detail')).toEqual(-1);

    await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByDocketNumber',
    });
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
    ).toBeUndefined();
    expect(
      cerebralTest.getState('advancedSearchForm.caseSearchByDocketNumber'),
    ).toEqual({});

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: queryParams.docketNumber,
    });
    await cerebralTest.runSequence(
      'submitPublicCaseDocketNumberSearchSequence',
      {},
    );
    searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(
      cerebralTest.currentRouteUrl.indexOf(
        `/case-detail/${params.docketNumber}`,
      ),
    ).toEqual(0);
  });
};

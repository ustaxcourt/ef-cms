import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unauthedUserSearchesForSealedCasesByDocketNumber =
  cerebralTest => {
    return it('Search for a sealed case by docket number', async () => {
      cerebralTest.currentRouteUrl = '';
      cerebralTest.setState('caseSearchByDocketNumber', {});

      await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
        formType: 'caseSearchByDocketNumber',
        key: 'docketNumber',
        value: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence(
        'submitPublicCaseDocketNumberSearchSequence',
      );

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
      ).toEqual([]);
      expect(cerebralTest.currentRouteUrl).toBe(
        `/case-detail/${cerebralTest.docketNumber}`,
      );
    });
  };

import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { COUNTRY_TYPES } = applicationContext.getConstants();

export const unauthedUserSearchesByMeta = (cerebralTest, overrides = {}) => {
  return it('Search for cases by meta data', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: 'Aliens, Dude',
      ...overrides,
    };

    cerebralTest.setState('advancedSearchForm.caseSearchByName', queryParams);

    await cerebralTest.runSequence(
      'submitPublicCaseAdvancedSearchSequence',
      {},
    );

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(searchResults.length).toBeGreaterThan(0);

    await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByName',
    });
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
    ).toBeUndefined();
    expect(cerebralTest.getState('advancedSearchForm')).toEqual({
      caseSearchByName: { countryType: COUNTRY_TYPES.DOMESTIC },
      currentPage: 1,
    });
  });
};

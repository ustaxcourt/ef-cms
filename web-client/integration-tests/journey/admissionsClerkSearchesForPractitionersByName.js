import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { advancedSearchHelper } from '../../src/presenter/computeds/AdvancedSearch/advancedSearchHelper';
import { formatNow } from '../../../shared/src/business/utilities/DateHandler';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const admissionsClerkSearchesForPractitionersByName = cerebralTest => {
  const practitionerResultsContainDuplicates = searchResults => {
    const barNumberOccurrences = {};
    searchResults.forEach(practitioner => {
      barNumberOccurrences[practitioner.barNumber] =
        1 + (barNumberOccurrences[practitioner.barNumber] || 0);
    });
    const resultsContainDuplicateBarNumbers = Object.values(
      barNumberOccurrences,
    ).some(count => count > 1);
    return resultsContainDuplicateBarNumbers;
  };

  return it('admissions clerk searches for practitioners by name', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');

    await refreshElasticsearchIndex();

    cerebralTest.setState(
      'advancedSearchTab',
      ADVANCED_SEARCH_TABS.PRACTITIONER,
    );

    await cerebralTest.runSequence('advancedSearchTabChangeSequence');

    expect(
      cerebralTest.getState('advancedSearchForm.practitionerSearchByName'),
    ).toEqual({});
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      ),
    ).toBeUndefined();

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');
    expect(
      cerebralTest.getState('validationErrors.practitionerName'),
    ).toBeDefined();

    // non-exact matches
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'test',
    });

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');
    expect(
      cerebralTest.getState('validationErrors.practitionerName'),
    ).toBeUndefined();

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
    );
    expect(practitionerResultsContainDuplicates(searchResults)).toBeFalsy();

    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      ).length,
    ).toBeGreaterThan(0);
    let helper = runCompute(withAppContextDecorator(advancedSearchHelper), {
      state: cerebralTest.getState(),
    });

    expect(helper.formattedSearchResults.length).toEqual(
      cerebralTest.getState('constants.CASE_SEARCH_PAGE_SIZE'),
    );
    expect(helper.showLoadMore).toBeTruthy();

    await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'practitionerSearchByName',
    });

    expect(
      cerebralTest.getState('advancedSearchForm.practitionerSearchByName'),
    ).toEqual({});
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      ),
    ).toBeUndefined();

    // exact match
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: `Joe ${cerebralTest.currentTimestamp} Exotic Tiger King`,
    });

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');

    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.0.name`,
      ),
    ).toEqual(`joe ${cerebralTest.currentTimestamp} exotic tiger king`);
    const currentTwoDigitYear = formatNow('YY');
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.0.barNumber`,
      ),
    ).toContain(`EJ${currentTwoDigitYear}`);

    // no matches
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'not a real name',
    });

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');

    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      ).length,
    ).toEqual(0);

    helper = runCompute(withAppContextDecorator(advancedSearchHelper), {
      state: cerebralTest.getState(),
    });

    expect(helper.showLoadMore).toBeFalsy();
    expect(helper.formattedSearchResults.length).toEqual(0);
    expect(helper.showNoMatches).toBeTruthy();
  });
};

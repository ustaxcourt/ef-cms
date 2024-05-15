import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { formatNow } from '../../../shared/src/business/utilities/DateHandler';
import { practitionerSearchHelper } from '../../src/presenter/computeds/AdvancedSearch/practitionerSearchHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const admissionsClerkSearchesForPractitionersByName = cerebralTest => {
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
    ).toEqual({
      activePage: 0,
      lastKeysOfPages: [],
      total: 0,
    });
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      ),
    ).toBeUndefined();

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');
    expect(
      cerebralTest.getState('validationErrors.practitionerName'),
    ).toBeDefined();

    // match
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: `Joe ${cerebralTest.fakeName} Exotic Tiger King`,
    });

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');

    let practitionerTotal = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.total`,
    );
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.practitioners`,
      ).length,
    ).toEqual(practitionerTotal);
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.total`,
      ),
    ).toEqual(practitionerTotal);
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.practitioners.0.name`,
      ),
    ).toEqual(`joe ${cerebralTest.fakeName} exotic tiger king`);
    const currentTwoDigitYear = formatNow('YEAR_TWO_DIGIT');
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.practitioners.0.barNumber`,
      ),
    ).toContain(`EJ${currentTwoDigitYear}`);

    let helper = runCompute(withAppContextDecorator(practitionerSearchHelper), {
      state: cerebralTest.getState(),
    });

    expect(helper.formattedSearchResults?.length).toBeGreaterThan(0);
    expect(helper.numberOfResults).toBeGreaterThan(0);
    expect(helper.showNoMatches).toBeFalsy();
    expect(helper.showSearchResults).toBeTruthy();

    // no matches
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'not a real name',
    });

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');
    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.practitioners`,
      ).length,
    ).toEqual(0);

    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.total`,
      ),
    ).toEqual(0);

    helper = runCompute(withAppContextDecorator(practitionerSearchHelper), {
      state: cerebralTest.getState(),
    });

    expect(helper.showNoMatches).toBeTruthy();
    expect(helper.showSearchResults).toBeFalsy();
  });
};

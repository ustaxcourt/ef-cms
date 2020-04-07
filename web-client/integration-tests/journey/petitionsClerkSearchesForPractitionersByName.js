import { advancedSearchHelper } from '../../src/presenter/computeds/advancedSearchHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkSearchesForPractitionersByName = test => {
  return it('petitions clerk searches for practitioners by name', async () => {
    await test.runSequence('gotoAdvancedSearchSequence');

    // simulate switching to the Practitioner tab
    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'advancedSearchTab',
      value: 'practitioner',
    });

    await test.runSequence('advancedSearchTabChangeSequence');

    expect(
      test.getState('advancedSearchForm.practitionerSearchByName'),
    ).toEqual({});
    expect(test.getState('searchResults')).toBeUndefined();

    await test.runSequence('submitPractitionerNameSearchSequence');
    expect(test.getState('validationErrors.practitionerName')).toBeDefined();

    // non-exact matches
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'test',
    });

    await test.runSequence('submitPractitionerNameSearchSequence');
    expect(test.getState('validationErrors.practitionerName')).toBeUndefined();

    expect(test.getState('searchResults').length).toBeGreaterThan(0);

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'practitionerSearchByName',
    });

    expect(
      test.getState('advancedSearchForm.practitionerSearchByName'),
    ).toEqual({});
    expect(test.getState('searchResults')).toBeUndefined();

    // exact match
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'test irs practitioner',
    });

    await test.runSequence('submitPractitionerNameSearchSequence');

    expect(test.getState('searchResults').length).toBeGreaterThan(0);
    expect(test.getState('searchResults.0.name')).toEqual(
      'Test IRS Practitioner',
    );

    let helper = runCompute(withAppContextDecorator(advancedSearchHelper), {
      state: test.getState(),
    });

    expect(helper.showLoadMore).toBeTruthy();
    expect(helper.formattedSearchResults.length).toEqual(
      test.getState('constants.CASE_SEARCH_PAGE_SIZE'),
    );

    // no matches
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'not a real name',
    });

    await test.runSequence('submitPractitionerNameSearchSequence');

    expect(test.getState('searchResults').length).toEqual(0);

    helper = runCompute(withAppContextDecorator(advancedSearchHelper), {
      state: test.getState(),
    });

    expect(helper.showLoadMore).toBeFalsy();
    expect(helper.formattedSearchResults.length).toEqual(0);
    expect(helper.showNoMatches).toBeTruthy();
  });
};

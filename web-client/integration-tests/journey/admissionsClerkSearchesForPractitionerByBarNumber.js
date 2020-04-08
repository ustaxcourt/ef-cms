export const admissionsClerkSearchesForPractitionerByBarNumber = test => {
  return it('admissions clerk searches for practitioner by bar number', async () => {
    await test.runSequence('gotoAdvancedSearchSequence');

    // simulate switching to the Practitioner tab
    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'advancedSearchTab',
      value: 'practitioner',
    });

    await test.runSequence('advancedSearchTabChangeSequence');

    expect(
      test.getState('advancedSearchForm.practitionerSearchByBarNumber'),
    ).toEqual({});
    expect(test.getState('searchResults')).toBeUndefined();

    await test.runSequence('submitPractitionerBarNumberSearchSequence');
    expect(test.getState('validationErrors.barNumber')).toBeDefined();

    // no matches
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByBarNumber',
      key: 'barNumber',
      value: 'abc123',
    });

    await test.runSequence('submitPractitionerBarNumberSearchSequence');
    expect(test.getState('validationErrors.barNumber')).toBeUndefined();

    expect(test.getState('searchResults').length).toEqual(0);
    expect(test.getState('currentPage')).toEqual('AdvancedSearch');

    // single match
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByBarNumber',
      key: 'barNumber',
      value: 'PT1234',
    });

    await test.runSequence('submitPractitionerBarNumberSearchSequence');

    expect(test.getState('currentPage')).toEqual('PractitionerDetail');

    expect(test.getState('practitionerDetail.barNumber')).toEqual('PT1234');
  });
};

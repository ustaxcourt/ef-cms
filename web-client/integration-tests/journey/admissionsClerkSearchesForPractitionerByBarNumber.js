import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const admissionsClerkSearchesForPractitionerByBarNumber =
  cerebralTest => {
    return it('admissions clerk searches for practitioner by bar number', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      cerebralTest.setState(
        'advancedSearchTab',
        ADVANCED_SEARCH_TABS.PRACTITIONER,
      );

      await cerebralTest.runSequence('advancedSearchTabChangeSequence');

      expect(
        cerebralTest.getState(
          'advancedSearchForm.practitionerSearchByBarNumber',
        ),
      ).toEqual({});
      expect(
        cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ),
      ).toEqual([]);

      await cerebralTest.runSequence(
        'submitPractitionerBarNumberSearchSequence',
      );
      expect(cerebralTest.getState('validationErrors.barNumber')).toBeDefined();

      // no matches
      await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
        formType: 'practitionerSearchByBarNumber',
        key: 'barNumber',
        value: 'abc123',
      });

      await cerebralTest.runSequence(
        'submitPractitionerBarNumberSearchSequence',
      );
      expect(
        cerebralTest.getState('validationErrors.barNumber'),
      ).toBeUndefined();

      expect(
        cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ).length,
      ).toEqual(0);
      expect(cerebralTest.getState('currentPage')).toEqual('AdvancedSearch');

      // single match
      await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
        formType: 'practitionerSearchByBarNumber',
        key: 'barNumber',
        value: 'PT1234',
      });

      await cerebralTest.runSequence(
        'submitPractitionerBarNumberSearchSequence',
      );

      expect(cerebralTest.getState('currentPage')).toEqual(
        'PractitionerDetail',
      );

      expect(cerebralTest.getState('practitionerDetail.barNumber')).toEqual(
        'PT1234',
      );
    });
  };

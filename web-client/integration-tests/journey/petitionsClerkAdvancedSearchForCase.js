import {
  ADVANCED_SEARCH_TABS,
  COUNTRY_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { CaseSearch } from '../../../shared/src/business/entities/cases/CaseSearch';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkAdvancedSearchForCase = cerebralTest => {
  return it('petitions clerk performs an advanced search for a case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoAdvancedSearchSequence');

    await cerebralTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      petitionerName: CaseSearch.VALIDATION_ERROR_MESSAGES.petitionerName,
    });

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'Stormborn',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMin',
      value: '1800',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMax',
      value: '2030',
    });

    await cerebralTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      yearFiledMax: 'Enter a valid ending year',
      yearFiledMin: 'Enter a valid start year',
    });

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMin',
      value: '2001',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMax',
      value: '2001',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await cerebralTest.runSequence('submitCaseAdvancedSearchSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest
        .getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`)
        .find(result => result.docketNumber === cerebralTest.docketNumber),
    ).toBeDefined();
  });
};

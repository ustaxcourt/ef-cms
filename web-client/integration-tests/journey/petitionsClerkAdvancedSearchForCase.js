import { COUNTRY_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { CaseSearch } from '../../../shared/src/business/entities/cases/CaseSearch';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkAdvancedSearchForCase = test => {
  return it('petitions clerk performs an advanced search for a case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      petitionerName: CaseSearch.VALIDATION_ERROR_MESSAGES.petitionerName,
    });

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'Stormborn',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMin',
      value: '1800',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMax',
      value: '2030',
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      yearFiledMax: 'Enter a valid ending year',
      yearFiledMin: 'Enter a valid start year',
    });

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMin',
      value: '2001',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMax',
      value: '2001',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');
    expect(test.getState('validationErrors')).toEqual({});

    expect(
      test
        .getState('searchResults')
        .find(result => result.docketNumber === test.docketNumber),
    ).toBeDefined();
  });
};

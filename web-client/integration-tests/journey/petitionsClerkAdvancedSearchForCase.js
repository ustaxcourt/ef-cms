import { CaseSearch } from '../../../shared/src/business/entities/cases/CaseSearch';
import { ContactFactory } from '../../../shared/src/business/entities/contacts/ContactFactory';

export default test => {
  return it('petitions clerk performs an advanced search for a case', async () => {
    // we need to wait for elasticsearch to get updated by the processing stream lambda after creating the case
    await new Promise(resolve => setTimeout(resolve, 3000));

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      petitionerName: CaseSearch.VALIDATION_ERROR_MESSAGES.petitionerName,
    });

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'petitionerName',
      value: 'Test',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'yearFiledMin',
      value: '1800',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'yearFiledMax',
      value: '2030',
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      yearFiledMax: 'Enter a valid ending year',
      yearFiledMin: 'Enter a valid start year',
    });

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'yearFiledMin',
      value: '2001',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'yearFiledMax',
      value: '2001',
    });
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'countryType',
      value: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
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

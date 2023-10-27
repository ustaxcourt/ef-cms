import {
  ADVANCED_SEARCH_TABS,
  COUNTRY_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { CaseSearch } from '../../../shared/src/business/entities/cases/CaseSearch';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { refreshElasticsearchIndex } from '../helpers';
const customMessages = extractCustomMessages(CaseSearch.VALIDATION_RULES, true);

export const petitionsClerkAdvancedSearchForCase = cerebralTest => {
  return it('petitions clerk performs an advanced search for a case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoAdvancedSearchSequence');

    await cerebralTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      petitionerName: customMessages.petitionerName[0],
    });

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'Stormborn',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'startDate',
      value: '12/1/00',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'endDate',
      value: '2/15/2002',
    });

    await cerebralTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      endDate: 'Format date as MM/DD/YYYY',
      startDate: 'Format date as MM/DD/YYYY',
    });

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'startDate',
      value: '12/01/2000',
    });
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'endDate',
      value: '02/15/2002',
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

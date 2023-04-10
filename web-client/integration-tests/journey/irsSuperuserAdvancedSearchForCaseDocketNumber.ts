import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const irsSuperuserAdvancedSearchForCaseDocketNumber = cerebralTest => {
  return it('irsSuperuser performs an advanced search for a case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoAdvancedSearchSequence');

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: cerebralTest.docketNumber,
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

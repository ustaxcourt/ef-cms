import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const irsSuperuserAdvancedSearchForCaseDocketNumber = test => {
  return it('irsSuperuser performs an advanced search for a case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: test.docketNumber,
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(
      test
        .getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`)
        .find(result => result.docketNumber === test.docketNumber),
    ).toBeDefined();
  });
};

import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const unassociatedUserAdvancedSearchForSealedCase = cerebralTest => {
  return it('unassociated user performs an advanced search by name for a sealed case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoAdvancedSearchSequence');

    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'NOTAREALNAMEFORTESTING',
    });

    await cerebralTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(
      cerebralTest
        .getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`)
        .find(result => result.docketNumber === cerebralTest.docketNumber),
    ).toBeUndefined();
  });
};

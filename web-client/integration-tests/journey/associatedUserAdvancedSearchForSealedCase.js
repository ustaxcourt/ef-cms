import { refreshElasticsearchIndex } from '../helpers';

export const associatedUserAdvancedSearchForSealedCase = test => {
  return it('associated user performs an advanced search by name for a sealed case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'NOTAREALNAMEFORTESTING',
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(
      test
        .getState('searchResults')
        .find(result => result.docketNumber === test.docketNumber),
    ).toBeDefined();
  });
};

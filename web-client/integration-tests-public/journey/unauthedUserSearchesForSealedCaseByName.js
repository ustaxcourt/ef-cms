import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export default test => {
  return it('Search for sealed case by name', async () => {
    await refreshElasticsearchIndex(3000);

    const queryParams = {
      petitionerName: 'NOTAREALNAMEFORTESTINGPUBLIC',
    };

    test.setState('advancedSearchForm.caseSearchByName', queryParams);

    await test.runSequence('submitPublicAdvancedSearchSequence', {});

    const searchResults = test.getState('searchResults');
    expect(searchResults.length).toEqual(0);
  });
};

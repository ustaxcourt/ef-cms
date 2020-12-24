import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOpinionByKeyword = test => {
  return it('Search for opinion by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'osteodontolignikeratic',
        startDate: '2001-01-01',
      },
    });

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).toEqual([]);

    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'opinion',
        opinionType: 'Memorandum Opinion',
        startDate: '2001-01-01',
      },
    });

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).toEqual([]);

    // search for an opinion on a sealed case
    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'opinion',
        opinionType: 'T.C. Opinion',
        startDate: '2001-01-01',
      },
    });

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
          documentTitle:
            'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
        }),
      ]),
    );
  });
};

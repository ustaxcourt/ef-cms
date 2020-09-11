import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOpinionByKeyword = test => {
  return it('Search for opinion by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'osteodontolignikeratic',
        startDate: '2001-01-01',
      },
    });

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('searchResults')).toEqual([]);

    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'opinion',
        opinionType: 'Summary Opinion',
        startDate: '2001-01-01',
      },
    });

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('searchResults')).toEqual([]);

    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'opinion',
        opinionType: 'T.C. Opinion',
        startDate: '2001-01-01',
      },
    });

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
          documentTitle:
            'T.C. Opinion Judge Armen Some very strong opinions about sunglasses',
        }),
      ]),
    );
  });
};

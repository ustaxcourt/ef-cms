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
        opinionType: 'Memorandum Opinion',
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

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: '659d001a-4d91-41f4-acd8-8417a1d2be49',
          documentTitle: 'Summary Opinion Chief Judge Fieri',
        }),
      ]),
    );
  });
};

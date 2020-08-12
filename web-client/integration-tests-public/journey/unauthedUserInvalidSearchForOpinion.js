import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';

export const unauthedUserInvalidSearchForOpinion = test => {
  return it('Search for opinion without a keyword', async () => {
    await test.runSequence('gotoPublicSearchSequence');

    await test.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });
};

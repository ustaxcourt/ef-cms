import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';

export const unauthedUserInvalidSearchForOpinion = cerebralTest => {
  return it('Search for opinion without a keyword', async () => {
    await cerebralTest.runSequence('gotoPublicSearchSequence');

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });
};

import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';

export const unauthedUserInvalidSearchForOrder = test => {
  return it('Search for order without a keyword', async () => {
    await test.runSequence('gotoPublicSearchSequence');

    test.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });
};

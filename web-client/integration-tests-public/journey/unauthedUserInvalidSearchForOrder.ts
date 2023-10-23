import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

export const unauthedUserInvalidSearchForOrder = cerebralTest => {
  return it('Search for order without a keyword', async () => {
    await cerebralTest.runSequence('gotoPublicSearchSequence');

    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');
    const customMessages = extractCustomMessages(
      DocumentSearch.VALIDATION_RULES,
      true,
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      keyword: customMessages.keyword[0],
    });
  });
};

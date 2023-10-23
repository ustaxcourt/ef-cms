import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

export const unauthedUserInvalidSearchForOpinion = cerebralTest => {
  return it('Search for opinion without a keyword', async () => {
    await cerebralTest.runSequence('gotoPublicSearchSequence');

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');
    const customMessages = extractCustomMessages(
      DocumentSearch.VALIDATION_RULES,
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      keyword: customMessages.keyword[0],
    });
  });
};

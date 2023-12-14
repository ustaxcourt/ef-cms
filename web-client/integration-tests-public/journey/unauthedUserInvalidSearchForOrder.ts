import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unauthedUserInvalidSearchForOrder = cerebralTest => {
  return it('Search for order without a keyword', async () => {
    await cerebralTest.runSequence('gotoPublicSearchSequence');

    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};

import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { updateOpinionForm } from '../helpers';

export const userSearchesForOpinion = (cerebralTest, params) => {
  return it('should return a list of opinions', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    await updateOpinionForm(cerebralTest, params);

    await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const stateOfAdvancedSearch = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
    );

    expect(stateOfAdvancedSearch).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.docketEntryId,
        }),
      ]),
    );
  });
};

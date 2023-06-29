import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { updateOpinionForm } from '../helpers';

export const userPerformsAdvancedOpinionSearch = (
  cerebralTest,
  getSearchParams,
  expectedObjectContentsMatcher,
) => {
  return it('should return the expected list of opinions', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    await updateOpinionForm(cerebralTest, getSearchParams());

    await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const stateOfAdvancedSearch = cerebralTest.getState('searchResults');

    expect(JSON.stringify(stateOfAdvancedSearch)).toMatch(
      expectedObjectContentsMatcher(),
    );
  });
};

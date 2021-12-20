import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { updateOpinionForm } from '../helpers';

export const userPerformsAdvancedOpinionSearch = (
  cerebralTest,
  getSearchParams,
  getExpectedObjectContents,
) => {
  return it('should return a list of opinions', async () => {
    console.log('*****getSearchParams returns*****', getSearchParams());
    console.log(
      '*****getExpectedObjectContents returns*****',
      getExpectedObjectContents(),
    );
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    await updateOpinionForm(cerebralTest, getSearchParams());

    await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const stateOfAdvancedSearch = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
    );

    expect(stateOfAdvancedSearch).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining(getExpectedObjectContents()),
      ]),
    );
  });
};

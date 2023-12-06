import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import {
  refreshElasticsearchIndex,
  updateOpinionForm,
} from '../../integration-tests/helpers';

export const unauthedUserSearchesForOpinionByDocketNumber = cerebralTest => {
  return it('unauthed user searches for opinion by docket number', async () => {
    await refreshElasticsearchIndex();
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    updateOpinionForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ docketNumber: cerebralTest.docketNumber }),
      ]),
    );
  });
};

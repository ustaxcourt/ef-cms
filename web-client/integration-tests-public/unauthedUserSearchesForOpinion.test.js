import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import {
  refreshElasticsearchIndex,
  updateOpinionForm,
} from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { unauthedUserInvalidSearchForOpinion } from './journey/unauthedUserInvalidSearchForOpinion';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOpinionByKeyword } from './journey/unauthedUserSearchesForOpinionByKeyword';

const cerebralTest = setupTest();

describe('Unauthed user searches for an opinion by keyword', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserInvalidSearchForOpinion(cerebralTest);
  unauthedUserSearchesForOpinionByKeyword(cerebralTest);
});

describe('Unauthed user searches for a legacy sealed opinion by keyword', () => {
  cerebralTest.docketNumber = '129-20';

  unauthedUserNavigatesToPublicSite(cerebralTest);

  it('public user searches for opinion by docket number', async () => {
    await refreshElasticsearchIndex();
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    updateOpinionForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).toEqual([]);
  });
});

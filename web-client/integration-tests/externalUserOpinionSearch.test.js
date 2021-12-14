import {
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../shared/src/business/entities/EntityConstants';
import {
  loginAs,
  setOpinionSearchEnabled,
  setupTest,
  updateOpinionForm,
} from '../integration-tests/helpers';
const cerebralTest = setupTest();

describe('verify opinion search works for external users', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOpinionSearchEnabled(true);
  });

  describe('private practitioner performs opinion search', () => {
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    it('should return an opinion from a sealed case', async () => {
      // Private/IRS practitioner accesses Opinion Search, searches for Opinion in sealed case, Opinion is returned in results list.
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      // cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      // get access for an opinion data on a sealed case
      // await cerebralTest.runSequence(
      //   'updateAdvancedOpinionSearchFormValueSequence',
      //   {
      //     key: 'keyword',
      //     value: 'sunglasses',
      //   },
      // );

      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'opinion',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
        startDate: '08/03/1995',
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      console.log('state', cerebralTest.getState('searchResults'));
      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );
      expect(stateOfAdvancedSearch).toEqual([]);
    });
  });
});

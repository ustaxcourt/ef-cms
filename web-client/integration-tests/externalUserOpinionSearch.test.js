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
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        keyword: 'sunglasses',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      expect(stateOfAdvancedSearch).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });
  });
});

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

      expect(stateOfAdvancedSearch).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });

    it('should not return an opinion that does not match', async () => {
      // Private/IRS practitioner accesses Opinion Search, searches for Opinion in sealed case, Opinion is returned in results list.
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        keyword: 'sunglasses',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      expect(stateOfAdvancedSearch).not.toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
          expect.objectContaining({
            docketEntryId: 'd085a9da-b4a6-41d2-aa40-f933fe2d4188',
            documentTitle:
              'Summary Opinion Judge Ashford An opinion for testing',
          }),
        ]),
      );
    });

    //Private/IRS practitioner accesses Opinion Search, searches using no keyword/phrase. Results list is returned.
    it('should return results with no keyword/phrase', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      console.log(
        'results',
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      );
      expect(stateOfAdvancedSearch).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
          expect.objectContaining({
            docketEntryId: 'd085a9da-b4a6-41d2-aa40-f933fe2d4188',
            documentTitle:
              'Summary Opinion Judge Ashford An opinion for testing',
          }),
        ]),
      );
    });

    // Private/IRS practitioner accesses Opinion Search, searches using combination of keyword/phrase and filters. Results list is returned.
    it('should return results with keyword/phrase and filters', async () => {});
  });
});

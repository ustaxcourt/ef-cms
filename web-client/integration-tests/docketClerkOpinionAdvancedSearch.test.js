import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { DocumentSearch } from '../../shared/src/business/entities/documents/DocumentSearch';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';

const cerebralTest = setupTest();

describe('docket clerk opinion advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('go to advanced opinion search tab', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    const judges = cerebralTest.getState('legacyAndCurrentJudges');
    expect(judges.length).toBeGreaterThan(0);

    const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
    expect(legacyJudge).toBeTruthy();

    await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });

  describe('search for things that should not be found', () => {
    it('search for a keyword that is not present in any served opinion', async () => {
      cerebralTest.setState('advancedSearchForm', {
        opinionSearch: {
          keyword: 'osteodontolignikeratic',
          startDate: '1995-08-03',
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });

    it('search for an opinion type that is not present in any served opinion', async () => {
      cerebralTest.setState('advancedSearchForm', {
        opinionSearch: {
          keyword: 'opinion',
          opinionType: 'Memorandum Opinion',
          startDate: '1995-08-03',
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });
  });

  describe('search for things that should be found', () => {
    it('search for a keyword that is present in a served opinion', async () => {
      cerebralTest.setState('advancedSearchForm', {
        opinionSearch: {
          keyword: 'sunglasses',
          startDate: '1995-08-03',
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });

    it('search for a keyword and docket number that is present in a served opinion', async () => {
      cerebralTest.setState('advancedSearchForm', {
        opinionSearch: {
          docketNumber: '105-20',
          keyword: 'sunglasses',
          startDate: '1995-08-03',
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });

    it('includes the number of pages present in each document in the search results', async () => {
      cerebralTest.setState('advancedSearchForm', {
        opinionSearch: {
          keyword: 'sunglasses',
          startDate: '1995-08-03',
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            numberOfPages: 1,
          }),
        ]),
      );
    });

    it('search for an opinion type that is present in any served opinion', async () => {
      cerebralTest.setState('advancedSearchForm', {
        opinionSearch: {
          keyword: 'opinion',
          opinionType: 'T.C. Opinion',
          startDate: '1995-08-03',
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
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

  it('clears search fields', async () => {
    cerebralTest.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'sunglasses',
      },
    });

    await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'opinionSearch',
    });

    expect(cerebralTest.getState('advancedSearchForm.opinionSearch')).toEqual({
      keyword: '',
    });
  });

  it('clears validation errors when switching tabs', async () => {
    cerebralTest.setState('advancedSearchForm', {
      opinionSearch: {},
    });

    await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('alertError')).toEqual({
      messages: ['Enter a keyword or phrase'],
      title: 'Please correct the following errors:',
    });

    await cerebralTest.runSequence('advancedSearchTabChangeSequence');

    expect(cerebralTest.getState('alertError')).not.toBeDefined();
  });
});

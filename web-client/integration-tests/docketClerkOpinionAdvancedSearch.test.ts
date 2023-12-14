import {
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../shared/src/business/entities/EntityConstants';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  updateOpinionForm,
} from './helpers';

describe('Docket clerk opinion advanced search', () => {
  const cerebralTest = setupTest();

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

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('should clear search fields when "Clear Search" is clicked', async () => {
    await cerebralTest.runSequence(
      'updateAdvancedOpinionSearchFormValueSequence',
      {
        key: 'keyword',
        value: 'sunglasses',
      },
    );

    await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'opinionSearch',
    });

    expect(cerebralTest.getState('advancedSearchForm.opinionSearch')).toEqual({
      dateRange: 'allDates',
      keyword: '',
      opinionTypes: {
        [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
        [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
        [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
        [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
      },
    });
  });

  it('should clear validation errors when advanced search tabs are changed', async () => {
    await cerebralTest.runSequence(
      'updateAdvancedOpinionSearchFormValueSequence',
      {
        key: 'dateRange',
        value: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      },
    );

    await cerebralTest.runSequence(
      'updateAdvancedOpinionSearchFormValueSequence',
      {
        key: 'startDate',
        value: '08/03/2995',
      },
    );

    await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('alertError')).toEqual({
      messages: ['Start date cannot be in the future. Enter valid start date.'],
      title: 'Please correct the following errors:',
    });

    await cerebralTest.runSequence('advancedSearchTabChangeSequence');

    expect(cerebralTest.getState('alertError')).not.toBeDefined();
  });

  describe('should not return results', () => {
    it('when searching by keyword that is not present in any served opinions', async () => {
      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'osteodontolignikeratic',
        startDate: '08/03/1995',
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });

    it('when searching by an opinion type that is not present in any served opinions', async () => {
      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'opinion',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
        },
        startDate: '08/03/1995',
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });

    it('when searching without selecting any opinion types', async () => {
      await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'opinionSearch',
      });

      await updateOpinionForm(cerebralTest, {
        keyword: 'opinion',
        opinionTypes: {},
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });

    it('when searching by docket number that is present in a served opinion but the opinion does NOT have an attached file', async () => {
      const docketNumberWithOpinionWithoutFileAttached = '101-11';

      await updateOpinionForm(cerebralTest, {
        docketNumber: docketNumberWithOpinionWithoutFileAttached,
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });

    it('when searching for a sealed opinion', async () => {
      await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'opinionSearch',
      });

      await updateOpinionForm(cerebralTest, {
        docketNumber: '129-20',
      });
      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual([]);
    });
  });

  describe('should return results', () => {
    it('when searching by keyword that is present in a served opinion', async () => {
      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'sunglasses',
        opinionTypes: { [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true },
        startDate: '08/03/1995',
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '1a92894e-83a5-48ba-9994-3ada44235deb',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });

    it('when searching by a keyword and docket number that is present in a served opinion', async () => {
      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        docketNumber: '105-20',
        keyword: 'sunglasses',
        startDate: '08/03/1995',
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '1a92894e-83a5-48ba-9994-3ada44235deb',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });

    it('when searching by opinion type that is present in a served opinion', async () => {
      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'opinion',
        opinionTypes: { [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true },
        startDate: '08/03/1995',
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '1a92894e-83a5-48ba-9994-3ada44235deb',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });
  });

  describe('search results table', () => {
    it('should include the number of pages present in each document', async () => {
      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'sunglasses',
        startDate: '08/03/1995',
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
  });

  describe('filtering by judge', () => {
    it('when searching for opinions with judge "Tia W. Mowry" should not return results for "Tamara W. Ashford"', async () => {
      await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'opinionSearch',
      });

      await cerebralTest.runSequence(
        'updateAdvancedOpinionSearchFormValueSequence',
        {
          key: 'judge',
          value: 'Mowry',
        },
      );

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );
      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(searchResults).toEqual([]);
      expect(
        searchResults.find(r => r.judge !== 'Tamara W. Ashford'),
      ).toBeUndefined();
    });

    it('when searching for opinions with judge "Ashford" should ONLY return results with judge "Ashford"', async () => {
      await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'opinionSearch',
      });

      await cerebralTest.runSequence(
        'updateAdvancedOpinionSearchFormValueSequence',
        {
          key: 'judge',
          value: 'Ashford',
        },
      );

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(searchResults).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            caseCaption: 'Hanae Guerrero, Petitioner',
            docketEntryId: '1a92894e-83a5-48ba-9994-3ada44235deb',
            docketNumber: '313-21',
            docketNumberWithSuffix: '313-21',
            documentTitle:
              'Summary Opinion Judge Ashford An opinion for testing',
            documentType: 'Summary Opinion',
            entityName: 'InternalDocumentSearchResult',
            eventCode: 'SOP',
            filingDate: '2021-10-25T18:57:31.742Z',
            isCaseSealed: false,
            isDocketEntrySealed: false,
            isFileAttached: true,
            isStricken: false,
            judge: 'Tamara W. Ashford',
            numberOfPages: 1,
            signedJudgeName: 'Maurice B. Foley',
          }),
        ]),
      );

      expect(
        searchResults.find(
          r => !(r.judge || r.signedJudgeName).includes('Ashford'),
        ),
      ).toBeUndefined();
    });
  });
});

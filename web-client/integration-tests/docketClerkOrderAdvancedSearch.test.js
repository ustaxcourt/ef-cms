import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { DocumentSearch } from '../../shared/src/business/entities/documents/DocumentSearch';
import {
  FORMATS,
  calculateISODate,
  createISODateString,
  deconstructDate,
  formatDateString,
} from '../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';

const test = setupTest();

const { COUNTRY_TYPES, DOCKET_NUMBER_SUFFIXES, SERVICE_INDICATOR_TYPES } =
  applicationContext.getConstants();

const seedData = {
  caseCaption: 'Hanan Al Hroub, Petitioner',
  contactPrimary: {
    address1: '123 Teachers Way',
    city: 'Haifa',
    country: 'Palestine',
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    name: 'Hanan Al Hroub',
    postalCode: '123456',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  },
  contactSecondary: {},
  docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
  docketNumber: '104-20',
  docketNumberSuffix:
    DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_RETIREMENT_PLAN_REVOCATION,
  documentContents:
    'Déjà vu, this is a seed order filed on Apr 13 at 11:01pm ET',
  documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
  filingDate: '2020-04-14T03:01:15.215Z',
  signedJudgeName: 'Maurice B. Foley',
};
const signedByJudge = 'Maurice B. Foley';
let caseDetail;

describe('docket clerk order advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.draftOrders = [];
  });

  afterAll(() => {
    test.closeSocket();
  });

  describe('performing data entry', () => {
    loginAs(test, 'petitioner@example.com');
    it('create case', async () => {
      caseDetail = await uploadPetition(test);
      expect(caseDetail).toBeDefined();
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'docketclerk@example.com');
    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(test, 0);
    docketClerkAddsDocketEntryFromOrder(test, 0);
    docketClerkServesDocument(test, 0);

    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(test, 1);
    docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);

    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(test, 2);
    docketClerkAddsDocketEntryFromOrderOfDismissal(test, 2);
    docketClerkServesDocument(test, 2);

    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order of something',
      eventCode: 'O',
      expectedDocumentType: 'Order',
    });
    docketClerkSignsOrder(test, 3);
    docketClerkAddsDocketEntryFromOrder(test, 3);
    docketClerkServesDocument(test, 3);
    docketClerkSealsCase(test);
  });

  describe('search form default behavior', () => {
    it('go to advanced order search tab', async () => {
      await refreshElasticsearchIndex();

      await test.runSequence('gotoAdvancedSearchSequence');
      test.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      const judges = test.getState('legacyAndCurrentJudges');
      expect(judges.length).toBeGreaterThan(0);

      const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
      expect(legacyJudge).toBeTruthy();

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('validationErrors')).toEqual({
        keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
      });
    });

    it('clears search fields', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await test.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'orderSearch',
      });

      expect(test.getState('advancedSearchForm.orderSearch')).toEqual({
        keyword: '',
      });
    });

    it('clears validation errors when switching tabs', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {},
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('alertError')).toEqual({
        messages: ['Enter a keyword or phrase'],
        title: 'Please correct the following errors:',
      });

      await test.runSequence('advancedSearchTabChangeSequence');

      expect(test.getState('alertError')).not.toBeDefined();
    });
  });

  describe('search for things that should not be found', () => {
    it('search for a keyword that is not present in any served order', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'osteodontolignikeratic',
          startDate: '2001-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('validationErrors')).toEqual({});
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a docket number that is not present in any served orders', async () => {
      const docketNumberNoOrders = '999-99';

      test.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: docketNumberNoOrders,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a case title that is not present in any served orders', async () => {
      const caseCaptionNoOrders = 'abcdefghijk';

      test.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseCaptionNoOrders,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a date range that does not contain served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          endDate: '2005-01-03',
          keyword: 'dismissal',
          startDate: '2005-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a judge that has not signed any served orders', async () => {
      const invalidJudge = 'Judge Exotic';

      test.setState('advancedSearchForm', {
        orderSearch: {
          judge: invalidJudge,
          keyword: 'dismissal',
          startDate: '2005-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });
  });

  describe('search for things that should be found', () => {
    it('search for a keyword that is present in served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[2].docketEntryId,
            isSealed: true,
          }),
        ]),
      );
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a docket number that is present in served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
          startDate: '1995-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a case title that is present in served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a date range that contains served orders', async () => {
      const endOrderCreationMoment = calculateISODate({
        howMuch: 1,
        unit: 'months',
      });
      const startOrderCreationMoment = calculateISODate({
        howMuch: -1,
        unit: 'months',
      });

      const {
        day: endDateDay,
        month: endDateMonth,
        year: endDateYear,
      } = deconstructDate(
        formatDateString(
          createISODateString(endOrderCreationMoment),
          FORMATS.MMDDYYYY,
        ),
      );
      const {
        day: startDateDay,
        month: startDateMonth,
        year: startDateYear,
      } = deconstructDate(
        formatDateString(
          createISODateString(startOrderCreationMoment),
          FORMATS.MMDDYYYY,
        ),
      );

      test.setState('advancedSearchForm', {
        orderSearch: {
          endDate: `${endDateYear}-${endDateMonth}-${endDateDay}`,
          keyword: 'dismissal',
          startDate: `${startDateYear}-${startDateMonth}-${startDateDay}`,
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      await refreshElasticsearchIndex();

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a judge that has signed served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          judge: signedByJudge,
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ docketEntryId: seedData.docketEntryId }),
        ]),
      );
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: test.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('includes the number of pages present in each document in the search results', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'Order of Dismissal Entered',
          startDate: '1000-01-01',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            numberOfPages: 1,
          }),
        ]),
      );
    });
  });
});

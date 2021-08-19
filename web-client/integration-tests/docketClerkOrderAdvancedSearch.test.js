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

const cerebralTest = setupTest();

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
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('performing data entry', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('create case', async () => {
      caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesAnOrder(cerebralTest, {
      documentTitle: 'Order',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest, 0);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
    docketClerkServesDocument(cerebralTest, 0);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(cerebralTest, 1);
    docketClerkAddsDocketEntryFromOrderOfDismissal(cerebralTest, 1);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(cerebralTest, 2);
    docketClerkAddsDocketEntryFromOrderOfDismissal(cerebralTest, 2);
    docketClerkServesDocument(cerebralTest, 2);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentTitle: 'Order of something',
      eventCode: 'O',
      expectedDocumentType: 'Order',
    });
    docketClerkSignsOrder(cerebralTest, 3);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 3);
    docketClerkServesDocument(cerebralTest, 3);
    docketClerkSealsCase(cerebralTest);
  });

  describe('search form default behavior', () => {
    it('go to advanced order search tab', async () => {
      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      const judges = cerebralTest.getState('legacyAndCurrentJudges');
      expect(judges.length).toBeGreaterThan(0);

      const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
      expect(legacyJudge).toBeTruthy();

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
      });
    });

    it('clears search fields', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'orderSearch',
      });

      expect(cerebralTest.getState('advancedSearchForm.orderSearch')).toEqual({
        keyword: '',
      });
    });

    it('clears validation errors when switching tabs', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {},
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(cerebralTest.getState('alertError')).toEqual({
        messages: ['Enter a keyword or phrase'],
        title: 'Please correct the following errors:',
      });

      await cerebralTest.runSequence('advancedSearchTabChangeSequence');

      expect(cerebralTest.getState('alertError')).not.toBeDefined();
    });
  });

  describe('search for things that should not be found', () => {
    it('search for a keyword that is not present in any served order', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'osteodontolignikeratic',
          startDate: '2001-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a docket number that is not present in any served orders', async () => {
      const docketNumberNoOrders = '999-99';

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: docketNumberNoOrders,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a case title that is not present in any served orders', async () => {
      const caseCaptionNoOrders = 'abcdefghijk';

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseCaptionNoOrders,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a date range that does not contain served orders', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          endDate: '2005-01-03',
          keyword: 'dismissal',
          startDate: '2005-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a judge that has not signed any served orders', async () => {
      const invalidJudge = 'Judge Exotic';

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          judge: invalidJudge,
          keyword: 'dismissal',
          startDate: '2005-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });
  });

  describe('search for things that should be found', () => {
    it('search for a keyword that is present in served orders', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
            isSealed: true,
          }),
        ]),
      );
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a docket number that is present in served orders', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
          startDate: '1995-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a case title that is present in served orders', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
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

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          endDate: `${endDateYear}-${endDateMonth}-${endDateDay}`,
          keyword: 'dismissal',
          startDate: `${startDateYear}-${startDateMonth}-${startDateDay}`,
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      await refreshElasticsearchIndex();

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a judge that has signed served orders', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          judge: signedByJudge,
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ docketEntryId: seedData.docketEntryId }),
        ]),
      );
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('includes the number of pages present in each document in the search results', async () => {
      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'Order of Dismissal Entered',
          startDate: '1000-01-01',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
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

import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';

import {
  embedWithLegalIpsumText,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('order search journey', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  beforeEach(() => {
    global.window ??= Object.create({
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    });
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('Creates case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  describe('creates tests which can be searched', () => {
    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('welcome to flavortown'),
      documentTitle: 'welcome to flavortown',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
    docketClerkServesDocument(cerebralTest, 0);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('welcome to flavortown'),
      documentTitle: 'hold on',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
    docketClerkServesDocument(cerebralTest, 1);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('wait till the partys over'),
      documentTitle: 'welcome to flavortown',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
    docketClerkServesDocument(cerebralTest, 2);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('nasty weather'),
      documentTitle: 'welcome to something flavortown today',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 3);
    docketClerkServesDocument(cerebralTest, 3);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('welcome from flavortown'),
      documentTitle: 'welcome from flavortown',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 4);
    docketClerkServesDocument(cerebralTest, 4);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('welcome to flavor-town'),
      documentTitle: 'welcome to flavor-town',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 5);
    docketClerkServesDocument(cerebralTest, 5);

    docketClerkCreatesAnOrder(cerebralTest, {
      documentContents: embedWithLegalIpsumText('welcome to flavortown.'),
      documentTitle: 'burning down the house',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 6);
    docketClerkServesDocument(cerebralTest, 6);
  });

  describe('searches for documents previously created', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    it('searches for an order by exact keyword `"nasty | wait"`', async () => {
      await refreshElasticsearchIndex();
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: '"nasty" | "wait"',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });

    it('searches for an order by keyword `nasty | wait`', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'nasty | wait',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });

    it('searches for an order by exact match keyword `"nasty" | "flavor-town" | partys`', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'nasty | "flavor-town" | partys',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[5].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(3);
    });

    it('searches for an order by keyword `"hold" | "something"` present in the documentTitle only', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'hold | something',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });

    it('searches for an order by keyword `hold | "something"` present in the documentTitle only', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'hold | "something"',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });

    it('searches for an order by keyword `"partys" | "nasty"` present in the documentContents only', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'partys | nasty',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });

    it('searches for an order by keyword `partys | "nasty"` present in the documentContents only', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'partys | "nasty"',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });

    it('searches for an order by keyword `nasty | "flavor-town"`', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: 'nasty | "flavor-town"',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[5].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
          }),
        ]),
      );

      expect(searchResults.length).toEqual(2);
    });
  });
});

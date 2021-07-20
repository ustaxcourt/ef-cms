import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('order search journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };
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

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'welcome to flavortown',
    documentTitle: 'welcome to flavortown',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'welcome to flavortown',
    documentTitle: 'hold on',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'wait till the partys over',
    documentTitle: 'welcome to flavortown',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'nasty weather',
    documentTitle: 'welcome to something flavortown',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'welcome from flavortown',
    documentTitle: 'welcome from flavortown',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'welcome to flavor-town',
    documentTitle: 'welcome to flavor-town',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'welcome to flavortown.',
    documentTitle: 'burning down the house',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('searches for an order by keyword `"welcome to flavortown"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"welcome to flavortown"',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '313-21',
          documentTitle: 'welcome to flavortown',
        }),
        expect.objectContaining({
          docketNumber: '313-21',
          documentContents: 'welcome to flavortown',
        }),
        expect.objectContaining({
          docketNumber: '313-21',
          documentContents: 'welcome to flavortown',
          documentTitle: 'welcome to flavortown',
        }),
        expect.objectContaining({
          docketNumber: '313-21',
          documentContents: 'welcome to flavortown.',
        }),
      ]),
    );

    expect(searchResults.length).toEqual(4);
  });

  it.skip('searches for an order by keyword `"welcome from flavortown"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"welcome from flavortown"',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual([
      expect.objectContaining({
        docketNumber: '313-21',
        documentTitle: 'welcome from flavortown',
      }),
    ]);

    expect(searchResults.length).toEqual(1);
  });

  it.skip('searches for an order by keyword `"welcome to flavor-town"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"welcome to flavor-town"',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual([
      expect.objectContaining({
        docketNumber: '313-21',
        documentTitle: 'welcome to flavor-town',
      }),
    ]);

    expect(searchResults.length).toEqual(1);
  });

  it.skip('searches for an order by keyword `"Welcome to Flavortown"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"Welcome to Flavortown"',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual([
      expect.objectContaining({
        docketNumber: '313-21',
        documentTitle: 'welcome to flavortown',
      }),
      expect.objectContaining({
        docketNumber: '313-21',
        documentContents: 'welcome to flavortown',
      }),
      expect.objectContaining({
        docketNumber: '313-21',
        documentContents: 'welcome to flavortown',
        documentTitle: 'welcome to flavortown',
      }),
      expect.objectContaining({
        docketNumber: '313-21',
        documentContents: 'welcome to flavortown.',
      }),
    ]);

    expect(searchResults.length).toEqual(4);
  });

  it.skip('searches for an order by keyword `"welcomes to flavortown"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"welcomes to flavortown"',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual([]);

    expect(searchResults.length).toEqual(0);
  });
});

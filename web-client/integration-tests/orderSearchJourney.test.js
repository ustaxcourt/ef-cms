import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setupTest } from './helpers';

const cerebralTest = setupTest();

describe.skip('order search journey', () => {
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

  it('searches for an order by keyword `"welcome from flavortown"`', async () => {
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

  it('searches for an order by keyword `"welcome to flavor-town"`', async () => {
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

  it('searches for an order by keyword `"Welcome to Flavortown"`', async () => {
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

  it('searches for an order by keyword `"welcomes to flavortown"`', async () => {
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

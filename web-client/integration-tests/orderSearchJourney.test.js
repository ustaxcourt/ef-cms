import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setupTest } from './helpers';

const cerebralTest = setupTest();

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

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('searches for an order by keyword', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'welcome to flavortown',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toMatchObject([
      {
        docketNumber: '313-21',
        documentTitle: 'welcome to flavortown',
      },
    ]);
  });
});

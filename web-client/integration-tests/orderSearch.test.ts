import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setOrderSearchEnabled, setupTest } from './helpers';

describe('Order search', () => {
  const cerebralTest = setupTest();

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOrderSearchEnabled(true, 'internal');
    await setOrderSearchEnabled(true, 'external');
  });

  describe('internal', () => {
    loginAs(cerebralTest, 'docketclerk1@example.com');

    it('should preserve the warning message when the user routes back to search from their dashboard', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
    });
  });

  describe('external', () => {
    loginAs(cerebralTest, 'privatepractitioner1@example.com');

    it('should preserve the warning message when the user routes back to search from their dashboard', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
    });
  });
});

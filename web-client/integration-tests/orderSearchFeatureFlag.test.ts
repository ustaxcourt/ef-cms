import {
  ADVANCED_SEARCH_TABS,
  ALLOWLIST_FEATURE_FLAGS,
} from '../../shared/src/business/entities/EntityConstants';
import {
  getFeatureFlagHelper,
  loginAs,
  setOrderSearchEnabled,
  setupTest,
} from './helpers';

describe('Order search feature flags', () => {
  const cerebralTest = setupTest();

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOrderSearchEnabled(true, 'internal');
    await setOrderSearchEnabled(true, 'external');
  });

  describe('internal', () => {
    loginAs(cerebralTest, 'docketclerk1@example.com');

    it('should display a warning message when the feature is disabled', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      await setOrderSearchEnabled(false, 'internal');

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.disabledMessage,
      );
    });

    it('should preserve the warning message when the user routes back to search from their dashboard', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.disabledMessage,
      );

      const { isOrderSearchEnabledForRole } =
        getFeatureFlagHelper(cerebralTest);

      expect(isOrderSearchEnabledForRole).toEqual(false);
    });
  });

  describe('external', () => {
    loginAs(cerebralTest, 'privatepractitioner1@example.com');

    it('should display a warning message when the feature is disabled', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      await setOrderSearchEnabled(false, 'external');

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.disabledMessage,
      );
    });

    it('should preserve the warning message when the user routes back to search from their dashboard', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.disabledMessage,
      );

      const { isOrderSearchEnabledForRole } =
        getFeatureFlagHelper(cerebralTest);

      expect(isOrderSearchEnabledForRole).toEqual(false);
    });
  });
});

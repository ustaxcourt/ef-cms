import {
  ADVANCED_SEARCH_TABS,
  ALLOWLIST_FEATURE_FLAGS,
} from '../../shared/src/business/entities/EntityConstants';
import {
  getFeatureFlagHelper,
  loginAs,
  setOpinionSearchEnabled,
  setupTest,
} from '../integration-tests/helpers';
const cerebralTest = setupTest();

describe('Opinion search feature flags', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOpinionSearchEnabled(true);
  });

  describe('internal', () => {
    loginAs(cerebralTest, 'docketclerk1@example.com');

    it('should display warning message when feature is disabled', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await setOpinionSearchEnabled(false);

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.disabledMessage,
      );
    });

    it('should preserve warning message when user reroutes back to opinion search', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.disabledMessage,
      );

      const { isInternalOpinionSearchEnabled } =
        getFeatureFlagHelper(cerebralTest);

      expect(isInternalOpinionSearchEnabled).toEqual(false);
    });
  });

  describe('external', () => {
    loginAs(cerebralTest, 'petitioner1@example.com');

    it('should display warning message when feature is disabled', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await setOpinionSearchEnabled(false);

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.disabledMessage,
      );
    });

    it('should preserve warning message when user reroutes back to opinion search', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
      const stateOfAlertWarning = cerebralTest.getState('alertWarning');

      expect(stateOfAdvancedSearch).toEqual(ADVANCED_SEARCH_TABS.CASE);
      expect(stateOfAlertWarning.message).toEqual(
        ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.disabledMessage,
      );

      const { isExternalOpinionSearchEnabled } =
        getFeatureFlagHelper(cerebralTest);

      expect(isExternalOpinionSearchEnabled).toEqual(false);
    });
  });
});

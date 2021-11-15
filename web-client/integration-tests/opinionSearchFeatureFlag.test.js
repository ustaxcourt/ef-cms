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

describe('verify opinion search is disabled when feature flag is turned off', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOpinionSearchEnabled(true);
  });

  describe('docket clerk performs opinion search', () => {
    loginAs(cerebralTest, 'docketclerk1@example.com');

    it('turns feature flag off to verify alert shows up', async () => {
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

    it('alert should still be visible after a page reroute', async () => {
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
});

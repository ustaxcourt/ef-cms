import {
  loginAs,
  setOpinionSearchEnabled,
  setupTest,
} from '../integration-tests/helpers';
const cerebralTest = setupTest();

describe('verify opinion search works for external users', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOpinionSearchEnabled(true);
  });

  describe('private practitioner performs opinion search', () => {
    it('should return an opinion from a sealed case', async () => {
      //Private/IRS practitioner accesses Opinion Search, searches for keyword/phrase, results list is returned. User clicks on result, which opens in a new tab
      loginAs(cerebralTest, 'privatePractitioner@example.com');

      // Private/IRS practitioner accesses Opinion Search, searches for Opinion in sealed case, Opinion is returned in results list.
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      // cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      // get access for an opinion data on a sealed case
      await cerebralTest.runSequence(
        'updateAdvancedOpinionSearchFormValueSequence',
        {
          key: 'keyword',
          value: 'sunglasses',
        },
      );

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      // cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),

      // const stateOfAdvancedSearch = cerebralTest.getState('advancedSearchTab');
    });
  });
});

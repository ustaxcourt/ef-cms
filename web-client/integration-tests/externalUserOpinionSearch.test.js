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
    //Private/IRS practitioner accesses Opinion Search, searches for keyword/phrase, results list is returned. User clicks on result, which opens in a new tab
    loginAs(cerebralTest, 'privatePractitioner@example.com');
  });
});

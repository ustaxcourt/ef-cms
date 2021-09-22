import { docketClerkCreatesAStandaloneRemoteTrialSession } from './journey/docketClerkCreatesAStandaloneRemoteTrialSession';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest } from './helpers';

const cerebralTest = setupTest();

describe('Docket clerk standalone remote trial session journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a standalone remote trial session with Small session type', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesAStandaloneRemoteTrialSession(cerebralTest);
    // docketClerkViewsTrialSessionList(cerebralTest);
    // docketClerkViewsNewTrialSession(cerebralTest);
  });
});

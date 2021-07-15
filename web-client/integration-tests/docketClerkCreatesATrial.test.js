import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest } from './helpers';

const cerebralTest = setupTest();

describe('Docket Clerk Creates A Trial', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    trialLocation: 'Peoria, Illinois',
  });
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkEditsTrialSession(cerebralTest);

  const trialLocation = `San Diego, California, ${Date.now()}`;
  docketClerkCreatesARemoteTrialSession(cerebralTest, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(cerebralTest);

  docketClerkCreatesARemoteTrialSession(cerebralTest, {
    sessionType: SESSION_TYPES.special,
  });
  docketClerkViewsTrialSessionList(cerebralTest);
});

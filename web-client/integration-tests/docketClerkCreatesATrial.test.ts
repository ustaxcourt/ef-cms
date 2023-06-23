import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest } from './helpers';

describe('Docket Clerk Creates A Trial', () => {
  const cerebralTest = setupTest();
  const previouslyCreatedTrialSessionId =
    '159c4338-0fac-42eb-b0eb-d53b8d0195cc';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    isSwingSession: true,
    swingSessionId: previouslyCreatedTrialSessionId,
    trialLocation: 'Peoria, Illinois',
  });
  docketClerkViewsTrialSessionList(cerebralTest, {
    expectSwingSession: true,
    expectedSwingSessionId: previouslyCreatedTrialSessionId,
  });
  docketClerkEditsTrialSession(cerebralTest);

  docketClerkCreatesARemoteTrialSession(cerebralTest, {
    trialLocation: `San Diego, California, ${Date.now()}`,
  });
  docketClerkViewsTrialSessionList(cerebralTest);

  docketClerkCreatesARemoteTrialSession(cerebralTest, {
    sessionType: SESSION_TYPES.special,
  });
  docketClerkViewsTrialSessionList(cerebralTest);
});

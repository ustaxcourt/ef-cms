import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest } from './helpers';

const test = setupTest();

describe('Docket Clerk Creates A Trial', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, {
    trialLocation: 'Peoria, Illinois',
  });
  docketClerkViewsTrialSessionList(test, {
    trialLocation: 'Peoria, Illinois',
  });
  docketClerkEditsTrialSession(test);

  const trialLocation = `San Diego, California, ${Date.now()}`;
  docketClerkCreatesARemoteTrialSession(test, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(test, {
    trialLocation,
  });

  docketClerkCreatesARemoteTrialSession(test, {
    sessionType: SESSION_TYPES.special,
  });
  docketClerkViewsTrialSessionList(test, {
    sessionType: SESSION_TYPES.special,
  });
});

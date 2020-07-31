import { docketClerkUpdatesCaseCaption } from './journey/docketClerkUpdatesCaseCaption';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerCancelsCreateCase } from './journey/petitionerCancelsCreateCase';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCaseTestAllOptions } from './journey/petitionerCreatesNewCaseTestAllOptions';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAssignsWorkItemToOther } from './journey/petitionsClerkAssignsWorkItemToOther';
import { petitionsClerkAssignsWorkItemToSelf } from './journey/petitionsClerkAssignsWorkItemToSelf';
import { petitionsClerkCaseSearch } from './journey/petitionsClerkCaseSearch';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkUpdatesCaseDetail } from './journey/petitionsClerkUpdatesCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsWorkQueue } from './journey/petitionsClerkViewsWorkQueue';
import { petitionsClerkViewsWorkQueueAfterReassign } from './journey/petitionsClerkViewsWorkQueueAfterReassign';
import { respondentAddsAnswer } from './journey/respondentAddsAnswer';
import { respondentAddsMotion } from './journey/respondentAddsMotion';
import { respondentAddsStipulatedDecision } from './journey/respondentAddsStipulatedDecision';
import { respondentViewsDashboard } from './journey/respondentViewsDashboard';

const test = setupTest();

describe('Case journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };
  });

  loginAs(test, 'petitioner@example.com');
  petitionerCancelsCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCaseTestAllOptions(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCaseSearch(test);
  petitionsClerkViewsWorkQueue(test);
  petitionsClerkAssignsWorkItemToSelf(test);
  petitionsClerkAssignsWorkItemToOther(test);
  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerkViewsWorkQueueAfterReassign(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkUpdatesCaseDetail(test);
  petitionsClerkSubmitsCaseToIrs(test);

  loginAs(test, 'irsPractitioner@example.com');
  respondentViewsDashboard(test);
  respondentAddsAnswer(test, fakeFile);
  respondentAddsStipulatedDecision(test, fakeFile);
  respondentAddsMotion(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
  docketClerkViewsCaseDetail(test);
  docketClerkUpdatesCaseCaption(test);
});

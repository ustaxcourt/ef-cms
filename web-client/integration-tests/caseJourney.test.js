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

const cerebralTest = setupTest();

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

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerCancelsCreateCase(cerebralTest);
  petitionerChoosesProcedureType(cerebralTest);
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCaseTestAllOptions(cerebralTest, fakeFile);
  petitionerViewsDashboard(cerebralTest);
  petitionerViewsCaseDetail(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCaseSearch(cerebralTest);
  petitionsClerkViewsWorkQueue(cerebralTest);
  petitionsClerkAssignsWorkItemToSelf(cerebralTest);
  petitionsClerkAssignsWorkItemToOther(cerebralTest);
  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkViewsWorkQueueAfterReassign(cerebralTest);
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkUpdatesCaseDetail(cerebralTest);
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  respondentViewsDashboard(cerebralTest);
  respondentAddsAnswer(cerebralTest, fakeFile);
  respondentAddsStipulatedDecision(cerebralTest, fakeFile);
  respondentAddsMotion(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsCaseDetail(cerebralTest);
  docketClerkUpdatesCaseCaption(cerebralTest);
});

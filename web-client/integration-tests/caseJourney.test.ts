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
import { respondentAddsMotionWithBrief } from './journey/respondentAddsMotionWithBrief';
import { respondentAddsStipulatedDecision } from './journey/respondentAddsStipulatedDecision';
import { respondentViewsDashboard } from './journey/respondentViewsDashboard';

describe('Case journey', () => {
  const cerebralTest = setupTest();

  beforeEach(() => {
    global.window ??= Object.create({
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    });
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

  loginAs(cerebralTest, 'irspractitioner@example.com');
  respondentViewsDashboard(cerebralTest);
  const documentCountPreStipDecision = 6;
  respondentAddsAnswer(cerebralTest, fakeFile, {
    documentCount: documentCountPreStipDecision,
  });
  respondentAddsStipulatedDecision(cerebralTest, fakeFile, {
    documentCount: documentCountPreStipDecision + 1,
  });
  respondentAddsMotionWithBrief(cerebralTest, fakeFile, {
    documentCount: documentCountPreStipDecision + 3,
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsCaseDetail(cerebralTest);
  docketClerkUpdatesCaseCaption(cerebralTest);
});

import { adcMarksWorkItemCompleteAndViewsCaseDetailAfterComplete } from './journey/adcMarksWorkItemCompleteAndViewsCaseDetailAfterComplete';
import { adcViewsDocumentDetail } from './journey/adcViewsDocumentDetail';
import { adcViewsMessages } from './journey/adcViewsMessages';
import { adcViewsMessagesAfterComplete } from './journey/adcViewsMessagesAfterComplete';
import { docketClerkAddsDocketEntries } from './journey/docketClerkAddsDocketEntries';
import { docketClerkAssignWorkItems } from './journey/docketClerkAssignWorkItems';
import { docketClerkDocketDashboard } from './journey/docketClerkDocketDashboard';
import { docketClerkForwardWorkItem } from './journey/docketClerkForwardWorkItem';
import { docketClerkSelectsAssignee } from './journey/docketClerkSelectsAssignee';
import { docketClerkSelectsWorkItems } from './journey/docketClerkSelectsWorkItems';
import { docketClerkStartsNewMessageThreadOnAnswer } from './journey/docketClerkStartsNewMessageThreadOnAnswer';
import { docketClerkStartsNewMessageThreadOnStipulatedDecisionToADC } from './journey/docketClerkStartsNewMessageThreadOnStipulatedDecisionToADC';
import { docketClerkUpdatesCaseCaption } from './journey/docketClerkUpdatesCaseCaption';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsDecisionDocument } from './journey/docketClerkViewsDecisionDocument';
import { docketClerkViewsDocument } from './journey/docketClerkViewsDocument';
import { docketClerkViewsMessages } from './journey/docketClerkViewsMessages';
import { docketClerkViewsMessagesAfterForward } from './journey/docketClerkViewsMessagesAfterForward';
import { docketClerkViewsMessagesWithoutWorkItem } from './journey/docketClerkViewsMessagesWithoutWorkItem';
import { docketClerkViewsOutboxAfterForward } from './journey/docketClerkViewsOutboxAfterForward';
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
import { petitionsClerkViewsMessages } from './journey/petitionsClerkViewsMessages';
import { petitionsClerkViewsMessagesAfterReassign } from './journey/petitionsClerkViewsMessagesAfterReassign';
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

  loginAs(test, 'petitioner');
  petitionerCancelsCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCaseTestAllOptions(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);

  loginAs(test, 'petitionsclerk');
  petitionsClerkCaseSearch(test);
  petitionsClerkViewsMessages(test);
  petitionsClerkAssignsWorkItemToSelf(test);
  petitionsClerkAssignsWorkItemToOther(test);
  loginAs(test, 'petitionsclerk1');
  petitionsClerkViewsMessagesAfterReassign(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkUpdatesCaseDetail(test);
  petitionsClerkSubmitsCaseToIrs(test);

  loginAs(test, 'irsPractitioner');
  respondentViewsDashboard(test);
  respondentAddsAnswer(test, fakeFile);
  respondentAddsStipulatedDecision(test, fakeFile);
  respondentAddsMotion(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkViewsMessagesWithoutWorkItem(test);
  docketClerkViewsCaseDetail(test);
  docketClerkUpdatesCaseCaption(test);
  docketClerkViewsDecisionDocument(test);
  docketClerkStartsNewMessageThreadOnAnswer(test);
  docketClerkStartsNewMessageThreadOnStipulatedDecisionToADC(test);

  loginAs(test, 'docketclerk1');
  docketClerkDocketDashboard(test);
  docketClerkSelectsAssignee(test);
  docketClerkSelectsWorkItems(test);
  docketClerkAssignWorkItems(test);
  loginAs(test, 'docketclerk');
  docketClerkViewsMessages(test);
  docketClerkViewsDocument(test);
  docketClerkForwardWorkItem(test);
  docketClerkViewsMessagesAfterForward(test);
  docketClerkViewsOutboxAfterForward(test);
  docketClerkAddsDocketEntries(test, fakeFile);

  loginAs(test, 'adc');
  adcViewsMessages(test);
  adcViewsDocumentDetail(test);
  adcMarksWorkItemCompleteAndViewsCaseDetailAfterComplete(test);
  adcViewsMessagesAfterComplete(test);
});

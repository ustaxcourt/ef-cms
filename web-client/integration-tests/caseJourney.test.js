import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { User } from '../../shared/src/business/entities/User';
import { isFunction, mapValues } from 'lodash';
import FormData from 'form-data';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');
import { Document } from '../../shared/src/business/entities/Document';
import { adcMarksStipulatedWorkItemAsCompleted } from './journey/adcMarksStipulatedWorkItemAsCompleted';
import { adcViewsCaseDetail } from './journey/adcViewsCaseDetail';
import { adcViewsCaseDetailAfterComplete } from './journey/adcViewsCaseDetailAfterComplete';
import { adcViewsDocumentDetail } from './journey/adcViewsDocumentDetail';
import { adcViewsMessages } from './journey/adcViewsMessages';
import { adcViewsMessagesAfterComplete } from './journey/adcViewsMessagesAfterComplete';
import { applicationContext } from '../src/applicationContext';
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
import { loginAs } from './helpers';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import petitionerCancelsCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCaseTestAllOptions from './journey/petitionerCreatesNewCaseTestAllOptions';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkAssignsWorkItemToOther from './journey/petitionsClerkAssignsWorkItemToOther';
import petitionsClerkAssignsWorkItemToSelf from './journey/petitionsClerkAssignsWorkItemToSelf';
import petitionsClerkCaseSearch from './journey/petitionsClerkCaseSearch';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkUpdatesCaseDetail from './journey/petitionsClerkUpdatesCaseDetail';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsMessages from './journey/petitionsClerkViewsMessages';
import petitionsClerkViewsMessagesAfterReassign from './journey/petitionsClerkViewsMessagesAfterReassign';
import respondentAddsAnswer from './journey/respondentAddsAnswer';
import respondentAddsMotion from './journey/respondentAddsMotion';
import respondentAddsStipulatedDecision from './journey/respondentAddsStipulatedDecision';
import respondentViewsDashboard from './journey/respondentViewsDashboard';

let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  createObjectURL: () => '/test-url',
  externalRoute: () => {},
  revokeObjectURL: () => {},
  route: async url => {
    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

presenter.state = mapValues(presenter.state, value => {
  if (isFunction(value)) {
    return withAppContextDecorator(value, applicationContext);
  }
  return value;
});

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Case journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      document: {},
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CATEGORIES: Document.CATEGORIES,
      CATEGORY_MAP: Document.CATEGORY_MAP,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      STATUS_TYPES: Case.STATUS_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
      USER_ROLES: User.ROLES,
    });
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
  adcViewsCaseDetail(test);
  adcViewsDocumentDetail(test);
  adcMarksStipulatedWorkItemAsCompleted(test);
  adcViewsCaseDetailAfterComplete(test);
  adcViewsMessagesAfterComplete(test);
});

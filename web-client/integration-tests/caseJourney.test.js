import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { isFunction, mapValues } from 'lodash';
import FormData from 'form-data';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');
import { Document } from '../../shared/src/business/entities/Document';
import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import docketClerkAddsDocketEntries from './journey/docketClerkAddsDocketEntries';
import docketClerkAssignWorkItems from './journey/docketClerkAssignWorkItems';
import docketClerkDocketDashboard from './journey/docketClerkDocketDashboard';
import docketClerkForwardWorkItem from './journey/docketClerkForwardWorkItem';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSelectsAssignee from './journey/docketClerkSelectsAssignee';
import docketClerkSelectsWorkItems from './journey/docketClerkSelectsWorkItems';
import docketClerkStartsNewMessageThreadOnAnswer from './journey/docketClerkStartsNewMessageThreadOnAnswer';
import docketClerkStartsNewMessageThreadOnStipulatedDecisionToSeniorAttorney from './journey/docketClerkStartsNewMessageThreadOnStipulatedDecisionToSeniorAttorney';
import docketClerkViewsCaseDetail from './journey/docketClerkViewsCaseDetail';
import docketClerkViewsDecisionDocument from './journey/docketClerkViewsDecisionDocument';
import docketClerkViewsDocument from './journey/docketClerkViewsDocument';
import docketClerkViewsMessages from './journey/docketClerkViewsMessages';
import docketClerkViewsMessagesAfterForward from './journey/docketClerkViewsMessagesAfterForward';
import docketClerkViewsMessagesWithoutWorkItem from './journey/docketClerkViewsMessagesWithoutWorkItem';
import docketClerkViewsOutboxAfterForward from './journey/docketClerkViewsOutboxAfterForward';
import petitionsClerkAssignsWorkItemToOther from './journey/petitionsClerkAssignsWorkItemToOther';
import petitionsClerkAssignsWorkItemToSelf from './journey/petitionsClerkAssignsWorkItemToSelf';
import petitionsClerkCaseSearch from './journey/petitionsClerkCaseSearch';
import petitionsClerkIrsHoldingQueue from './journey/petitionsClerkIrsHoldingQueue';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkUpdatesCaseCaption from './journey/petitionsClerkUpdatesCaseCaption';
import petitionsClerkUpdatesCaseDetail from './journey/petitionsClerkUpdatesCaseDetail';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsMessages from './journey/petitionsClerkViewsMessages';
import petitionsClerkViewsMessagesAfterReassign from './journey/petitionsClerkViewsMessagesAfterReassign';
import respondentAddsAnswer from './journey/respondentAddsAnswer';
import respondentAddsMotion from './journey/respondentAddsMotion';
import respondentAddsStipulatedDecision from './journey/respondentAddsStipulatedDecision';
import respondentLogIn from './journey/respondentLogIn';
import respondentViewsCaseDetailOfBatchedCase from './journey/respondentViewsCaseDetailOfBatchedCase';
import respondentViewsDashboard from './journey/respondentViewsDashboard';
import seniorAttorneyLogIn from './journey/seniorAttorneyLogIn';
import seniorAttorneyMarksStipulatedWorkItemAsCompleted from './journey/seniorAttorneyMarksStipulatedWorkItemAsCompleted';
import seniorAttorneyViewsCaseDetail from './journey/seniorAttorneyViewsCaseDetail';
import seniorAttorneyViewsCaseDetailAfterComplete from './journey/seniorAttorneyViewsCaseDetailAfterComplete';
import seniorAttorneyViewsDocumentDetail from './journey/seniorAttorneyViewsDocumentDetail';
import seniorAttorneyViewsMessages from './journey/seniorAttorneyViewsMessages';
import seniorAttorneyViewsMessagesAfterComplete from './journey/seniorAttorneyViewsMessagesAfterComplete';
import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerCancelsCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCaseTestAllOptions from './journey/taxpayerCreatesNewCaseTestAllOptions';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerViewsCaseDetail from './journey/taxpayerViewsCaseDetail';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  externalRoute: () => {},
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
    });
  });

  taxpayerLogin(test);
  taxpayerCancelsCreateCase(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCaseTestAllOptions(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerViewsCaseDetail(test);
  taxPayerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkCaseSearch(test);
  petitionsClerkViewsMessages(test);
  petitionsClerkAssignsWorkItemToSelf(test);
  petitionsClerkAssignsWorkItemToOther(test);
  petitionsClerkLogIn(test, 'petitionsclerk1');
  petitionsClerkViewsMessagesAfterReassign(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkUpdatesCaseDetail(test);
  petitionsClerkUpdatesCaseCaption(test);
  petitionsClerkSubmitsCaseToIrs(test);
  petitionsClerkIrsHoldingQueue(test);

  respondentLogIn(test);
  respondentViewsDashboard(test);
  respondentViewsCaseDetailOfBatchedCase(test);
  respondentAddsAnswer(test, fakeFile);
  respondentAddsStipulatedDecision(test, fakeFile);
  respondentAddsMotion(test, fakeFile);

  docketClerkLogIn(test);
  docketClerkViewsMessagesWithoutWorkItem(test);
  docketClerkViewsCaseDetail(test);
  docketClerkViewsDecisionDocument(test);
  docketClerkStartsNewMessageThreadOnAnswer(test);
  docketClerkStartsNewMessageThreadOnStipulatedDecisionToSeniorAttorney(test);

  docketClerkLogIn(test, 'docketclerk1');
  docketClerkDocketDashboard(test);
  docketClerkSelectsAssignee(test);
  docketClerkSelectsWorkItems(test);
  docketClerkAssignWorkItems(test);
  docketClerkLogIn(test);
  docketClerkViewsMessages(test);
  docketClerkViewsDocument(test);
  docketClerkForwardWorkItem(test);
  docketClerkViewsMessagesAfterForward(test);
  docketClerkViewsOutboxAfterForward(test);
  docketClerkAddsDocketEntries(test, fakeFile);

  seniorAttorneyLogIn(test);
  seniorAttorneyViewsMessages(test);
  seniorAttorneyViewsCaseDetail(test);
  seniorAttorneyViewsDocumentDetail(test);
  seniorAttorneyMarksStipulatedWorkItemAsCompleted(test);
  seniorAttorneyViewsCaseDetailAfterComplete(test);
  seniorAttorneyViewsMessagesAfterComplete(test);
});

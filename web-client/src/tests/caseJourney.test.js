import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';

import applicationContext from '../applicationContext';
import presenter from '../presenter';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';

import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerNavigatesToCreateCase from './journey/taxpayerNavigatesToCreateCase';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
import taxpayerViewsCaseDetail from './journey/taxpayerViewsCaseDetail';

import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkViewsDashboard from './journey/petitionsClerkViewsDashboard';
import petitionsClerkCaseSearch from './journey/petitionsClerkCaseSearch';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkRecordsPayGovId from './journey/petitionsClerkRecordsPayGovId';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';

import respondentLogIn from './journey/respondentLogIn';
import respondentViewsDashboard from './journey/respondentViewsDashboard';
import respondentViewsCaseDetail from './journey/respondentViewsCaseDetail';
import respondentAddsAnswer from './journey/respondentAddsAnswer';
import respondentAddsStipulatedDecision from './journey/respondentAddsStipulatedDecision';

import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkViewsDashboard from './journey/docketClerkViewsDashboard'; // TODO: this will need to change since uploaded stipulated decisions do NOT create a work item to the docketclerk user any more
import docketClerkDocketDashboard from './journey/docketClerkDocketDashboard';
import docketClerkViewsDocument from './journey/docketClerkViewsDocument';
import docketClerkViewsDecisionDocument from './journey/docketClerkViewsDecisionDocument';
import docketClerkForwardWorkItem from './journey/docketClerkForwardWorkItem';
import docketClerkViewsDashboardWithoutWorkItem from './journey/docketClerkViewsDashboardWithoutWorkItem';
import docketClerkSelectsAssignee from './journey/docketClerkSelectsAssignee';
import docketClerkSelectsWorkItems from './journey/docketClerkSelectsWorkItems';
import docketClerkAssignWorkItems from './journey/docketClerkAssignWorkItems';
import dockerClerkViewsCaseDetail from './journey/dockerClerkViewsCaseDetail';
import docketClerkViewsDashboardAfterForward from './journey/docketClerkViewsDashboardAfterForward';

import seniorAttorneyLogIn from './journey/seniorAttorneyLogIn';
import seniorAttorneyViewsDashboard from './journey/seniorAttorneyViewsDashboard';
import seniorAttorneyViewsCaseDetail from './journey/seniorAttorneyViewsCaseDetail';
import seniorAttorneyViewsDocumentDetail from './journey/seniorAttorneyViewsDocumentDetail';
import seniorAttorneyMarksStipulatedWorkItemAsCompleted from './journey/seniorAttorneyMarksStipulatedWorkItemAsCompleted';
import seniorAttorneyViewsCaseDetailAfterComplete from './journey/seniorAttorneyViewsCaseDetailAfterComplete';
import seniorAttorneyViewsDashboardAfterComplete from './journey/seniorAttorneyViewsDashboardAfterComplete';

let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }
  },
};

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = new Buffer(fakeData, 'base64', {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Case journey', async () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesCaseType(test);
  taxpayerChoosesProcedureType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerViewsCaseDetail(test);

  petitionsClerkLogIn(test);
  petitionsClerkCaseSearch(test);
  petitionsClerkViewsDashboard(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkRecordsPayGovId(test);
  petitionsClerkSubmitsCaseToIrs(test);

  respondentLogIn(test);
  respondentViewsDashboard(test);
  respondentViewsCaseDetail(test);
  respondentAddsAnswer(test, fakeFile);
  respondentAddsStipulatedDecision(test, fakeFile);

  docketClerkLogIn(test);
  docketClerkViewsDashboardWithoutWorkItem(test);
  dockerClerkViewsCaseDetail(test);
  docketClerkViewsDecisionDocument(test);

  docketClerkLogIn(test, 'docketclerk1');
  docketClerkDocketDashboard(test);
  docketClerkSelectsAssignee(test);
  docketClerkSelectsWorkItems(test);
  docketClerkAssignWorkItems(test);
  docketClerkLogIn(test);
  docketClerkViewsDashboard(test);
  docketClerkViewsDocument(test);
  docketClerkForwardWorkItem(test);
  docketClerkViewsDashboardAfterForward(test);

  seniorAttorneyLogIn(test);
  seniorAttorneyViewsDashboard(test);
  seniorAttorneyViewsCaseDetail(test);
  seniorAttorneyViewsDocumentDetail(test);
  seniorAttorneyMarksStipulatedWorkItemAsCompleted(test);
  seniorAttorneyViewsCaseDetailAfterComplete(test);
  seniorAttorneyViewsDashboardAfterComplete(test);
});

import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
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
import docketClerkForwardWorkItem from './journey/docketClerkForwardWorkItem';
import docketClerkViewsDashboardWithoutWorkItem from './journey/docketClerkViewsDashboardWithoutWorkItem';
import docketClerkSelectsAssignee from './journey/docketClerkSelectsAssignee';
import docketClerkSelectsWorkItems from './journey/docketClerkSelectsWorkItems';
import docketClerkAssignWorkItems from './journey/docketClerkAssignWorkItems';

import seniorAttorneyLogIn from './journey/seniorAttorneyLogIn';
import seniorAttorneyViewsDashboard from './journey/seniorAttorneyViewsDashboard';

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

const fakeFile = new Buffer(['TEST'], {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Case journey', async () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogin(test);
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
  docketClerkLogIn(test, 'docketclerk1');
  docketClerkDocketDashboard(test);
  docketClerkSelectsAssignee(test);
  docketClerkSelectsWorkItems(test);
  docketClerkAssignWorkItems(test);
  docketClerkLogIn(test);
  docketClerkViewsDashboard(test);
  docketClerkViewsDocument(test);
  docketClerkForwardWorkItem(test);
  seniorAttorneyLogIn(test);
  seniorAttorneyViewsDashboard(test);
});

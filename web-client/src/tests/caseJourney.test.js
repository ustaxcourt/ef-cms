import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
import taxpayerViewsCaseDetail from './journey/taxpayerViewsCaseDetail';

import petitionsClerkViewsDashboard from './journey/petitionsClerkViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
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
import docketClerkViewsDashboard from './journey/docketClerkViewsDashboard';
import docketClerkViewsDocument from './journey/docketClerkViewsDocument';
import docketClerkForwardWorkItem from './journey/docketClerkForwardWorkItem';
import docketClerkViewsDashboardWithoutWorkItem from './journey/docketClerkViewsDashboardWithoutWorkItem';

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
    jest.setTimeout(10000);
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
  docketClerkViewsDashboard(test);
  docketClerkViewsDocument(test);
  docketClerkForwardWorkItem(test);
  docketClerkViewsDashboardWithoutWorkItem(test);
  seniorAttorneyLogIn(test);
  seniorAttorneyViewsDashboard(test);
});

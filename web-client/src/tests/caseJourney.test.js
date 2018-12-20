import { CerebralTest, runCompute } from 'cerebral/test';
import FormData from 'form-data';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

import taxpayerLogin from './journey/taxpayerLogin';
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

import Case from '../../../shared/src/business/entities/Case';

let test;
let workItemId;
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
  taxpayerLogin(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerViewsCaseDetail(test);
  petitionsClerkLogIn(test);
  petitionsClerkCaseSearch(test);
  petitionsClerkViewsDashboard(test);
  petitionsClerkViewsCaseDetail(test, runCompute);
  petitionsClerkRecordsPayGovId(test, runCompute);
  petitionsClerkSubmitsCaseToIrs(test);
  respondentLogIn(test);
  respondentViewsDashboard(test);
  respondentViewsCaseDetail(test);

  it('Respondent adds answer', async () => {
    await test.runSequence('updateDocumentValueSequence', {
      key: 'documentType',
      value: Case.documentTypes.answer,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'file',
      value: fakeFile,
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('caseDetail.documents').length).toEqual(4);
  });

  it('Respondent adds a stipulated decision', async () => {
    await test.runSequence('updateDocumentValueSequence', {
      key: 'documentType',
      value: Case.documentTypes.stipulatedDecision,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'file',
      value: fakeFile,
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('caseDetail.documents').length).toEqual(5);
  });

  it('the respondent uploads a stipulated decision to the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'documentType',
      value: Case.documentTypes.stipulatedDecision,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'file',
      value: fakeFile,
    });
    await test.runSequence('submitDocumentSequence');
  });

  it('the docketclerk logs in', async () => {
    test.setState('user', {
      name: 'Docket Clerk',
      role: 'docketclerk',
      token: 'docketclerk',
      userId: 'docketclerk',
    });
  });

  it('the expected work item appears on the docketclerk queue', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardDocketClerk');
    const workItems = test.getState('workQueue');
    const workItemCreated = workItems.find(
      item => item.docketNumber === test.docketNumber,
    );
    workItemId = workItemCreated.workItemId;
    expect(workItemCreated).toMatchObject({
      assigneeId: 'docketclerk',
      assigneeName: 'Docket Clerk',
      caseStatus: 'general',
      caseTitle:
        'Test Taxpayer v. Commissioner of Internal Revenue, Respondent',
      docketNumber: test.docketNumber,
      document: {
        documentType: 'Stipulated Decision',
        filedBy: 'Respondent',
        userId: 'respondent',
      },
      messages: [
        {
          message: 'Stipulated Decision submitted',
        },
      ],
      sentBy: 'respondent',
    });
  });

  it('the docketclerk navigates to view the work item', async () => {
    await test.runSequence('gotoWorkItemSequence', {
      workItemId,
    });
    expect(test.getState('workItem')).toMatchObject({
      assigneeId: 'docketclerk',
      assigneeName: 'Docket Clerk',
      caseStatus: 'general',
      caseTitle:
        'Test Taxpayer v. Commissioner of Internal Revenue, Respondent',
      docketNumber: test.docketNumber,
      document: {
        documentType: 'Stipulated Decision',
        filedBy: 'Respondent',
        userId: 'respondent',
      },
      messages: [
        {
          message: 'Stipulated Decision submitted',
        },
      ],
      sentBy: 'respondent',
    });
  });

  it('the docketclerk forwards the work item to the senior attorney', async () => {
    test.setState('workItem', {
      ...test.getState('workItem'),
      assigneeId: 'seniorattorney',
    });
    await test.runSequence('updateWorkItemSequence');
  });

  it('the expected work item is gone from the docketclerk queue', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardDocketClerk');
    const workItems = test.getState('workQueue');
    const workItemCreated = workItems.find(
      item => item.docketNumber === test.docketNumber,
    );
    expect(workItemCreated).toEqual(undefined);
  });

  it('the seniorattorney logs in', async () => {
    test.setState('user', {
      name: 'Senior Attorney',
      role: 'seniorattorney',
      token: 'seniorattorney',
      userId: 'seniorattorney',
    });
  });

  it('the expected work item appears on the seniorattorney work queue', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardSeniorAttorney');
    const workItems = test.getState('workQueue');
    const workItemCreated = workItems.find(
      item => item.docketNumber === test.docketNumber,
    );
    expect(workItemCreated).toMatchObject({
      assigneeId: 'seniorattorney',
      assigneeName: 'Docket Clerk',
      caseStatus: 'general',
      caseTitle:
        'Test Taxpayer v. Commissioner of Internal Revenue, Respondent',
      docketNumber: test.docketNumber,
      document: {
        documentType: 'Stipulated Decision',
        filedBy: 'Respondent',
        userId: 'respondent',
      },
      messages: [
        {
          message: 'Stipulated Decision submitted',
        },
      ],
      sentBy: 'respondent',
    });
  });
});

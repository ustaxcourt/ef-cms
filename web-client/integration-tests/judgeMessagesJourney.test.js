import { docketClerkCreatesMessageToJudge } from './journey/docketClerkCreatesMessageToJudge';
import { fakeFile, loginAs, setupTest } from './helpers';
import { judgeViewsCaseDetail } from './journey/judgeViewsCaseDetail';
import { judgeViewsDashboardMessages } from './journey/judgeViewsDashboardMessages';
import { petitionerAddNewCaseToTestObj } from './journey/petitionerAddNewCaseToTestObj';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsCaseDetailAfterFilingDocument } from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkCreatesMessageToJudge } from './journey/petitionsClerkCreatesMessageToJudge';

const test = setupTest();

describe('Judge messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  const createdCases = [];

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);
  petitionerFilesDocumentForCase(test, fakeFile);
  petitionerAddNewCaseToTestObj(test, createdCases);
  petitionerViewsCaseDetailAfterFilingDocument(test);
  petitionerViewsDashboard(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesMessageToJudge(
    test,
    "don't forget to be awesome",
    createdCases,
  );

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesMessageToJudge(
    test,
    'karma karma karma karma karma chameleon',
    createdCases,
  );

  loginAs(test, 'judgeArmen@example.com');
  judgeViewsDashboardMessages(test);
  judgeViewsCaseDetail(test);
});

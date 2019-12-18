import { fakeFile, setupTest } from './helpers';
import docketClerkCreatesMessageToJudge from './journey/docketClerkCreatesMessageToJudge';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import judgeLogIn from './journey/judgeLogIn';
import judgeSignsOut from './journey/judgeSignsOut';
import judgeViewsCaseDetail from './journey/judgeViewsCaseDetail';
import judgeViewsDashboardMessages from './journey/judgeViewsDashboardMessages';
import petitionerAddNewCaseToTestObj from './journey/petitionerAddNewCaseToTestObj';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerFilesDocumentForCase from './journey/petitionerFilesDocumentForCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';
import petitionerViewsCaseDetailAfterFilingDocument from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkCreatesMessageToJudge from './journey/petitionsClerkCreatesMessageToJudge';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';

const test = setupTest();

describe('Judge messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);
  petitionerFilesDocumentForCase(test, fakeFile);
  petitionerViewsCaseDetailAfterFilingDocument(test);
  petitionerViewsDashboard(test);
  petitionerAddNewCaseToTestObj(test);
  petitionerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkCreatesMessageToJudge(test, "don't forget to be awesome");
  petitionsClerkSignsOut(test);

  docketClerkLogIn(test);
  docketClerkCreatesMessageToJudge(
    test,
    'karma karma karma karma karma chameleon',
  );
  docketClerkSignsOut(test);

  judgeLogIn(test);
  judgeViewsDashboardMessages(test);
  judgeViewsCaseDetail(test);
  judgeSignsOut(test);
});

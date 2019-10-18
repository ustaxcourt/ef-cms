import { fakeFile, setupTest } from './helpers';
import docketClerkCreatesMessageToJudge from './journey/docketClerkCreatesMessageToJudge';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import judgeLogIn from './journey/judgeLogIn';
import judgeSignsOut from './journey/judgeSignsOut';
import judgeViewsCaseDetail from './journey/judgeViewsCaseDetail';
import judgeViewsDashboardMessages from './journey/judgeViewsDashboardMessages';
import petitionsClerkCreatesMessageToJudge from './journey/petitionsClerkCreatesMessageToJudge';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import taxpayerAddNewCaseToTestObj from './journey/taxpayerAddNewCaseToTestObj';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerFilesDocumentForCase from './journey/taxpayerFilesDocumentForCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerViewsCaseDetail from './journey/taxpayerViewsCaseDetail';
import taxpayerViewsCaseDetailAfterFilingDocument from './journey/taxpayerViewsCaseDetailAfterFilingDocument';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

const test = setupTest();

describe('Judge messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerViewsCaseDetail(test);
  taxpayerFilesDocumentForCase(test, fakeFile);
  taxpayerViewsCaseDetailAfterFilingDocument(test);
  taxpayerViewsDashboard(test);
  taxpayerAddNewCaseToTestObj(test);
  taxpayerSignsOut(test);

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

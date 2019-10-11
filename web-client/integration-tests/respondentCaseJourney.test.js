import { fakeFile, setupTest } from './helpers';
import respondent1ViewsCaseDetailOfAssociatedCase from './journey/respondent1ViewsCaseDetailOfAssociatedCase';
import respondentFilesDocumentForAssociatedCase from './journey/respondentFilesDocumentForAssociatedCase';
import respondentFilesFirstIRSDocumentOnCase from './journey/respondentFilesFirstIRSDocumentOnCase';
import respondentLogin from './journey/respondentLogIn';
import respondentRequestsAccessToCase from './journey/respondentRequestsAccessToCase';
import respondentSearchesForCase from './journey/respondentSearchesForCase';
import respondentSearchesForNonexistentCase from './journey/respondentSearchesForNonexistentCase';
import respondentSignsOut from './journey/respondentSignsOut';
import respondentViewsCaseDetail from './journey/respondentViewsCaseDetail';
import respondentViewsCaseDetailOfAssociatedCase from './journey/respondentViewsCaseDetailOfAssociatedCase';
import respondentViewsCaseDetailOfUnassociatedCase from './journey/respondentViewsCaseDetailOfUnassociatedCase';
import respondentViewsDashboard from './journey/respondentViewsDashboard';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

const test = setupTest();

describe('Respondent requests access to a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerSignsOut(test);

  respondentLogin(test);
  respondentSearchesForNonexistentCase(test);
  respondentViewsDashboard(test);
  respondentSearchesForCase(test);
  respondentViewsCaseDetail(test);
  respondentFilesFirstIRSDocumentOnCase(test, fakeFile);
  respondentViewsDashboard(test);
  respondentViewsCaseDetailOfAssociatedCase(test);
  respondentFilesDocumentForAssociatedCase(test, fakeFile);
  respondentSignsOut(test);

  respondentLogin(test, 'respondent1');
  respondentSearchesForCase(test);
  respondentViewsCaseDetailOfUnassociatedCase(test);
  respondentRequestsAccessToCase(test, fakeFile);
  respondent1ViewsCaseDetailOfAssociatedCase(test);
  respondentFilesDocumentForAssociatedCase(test, fakeFile);
  respondentSignsOut(test);
});

import { fakeFile, setupTest } from './helpers';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
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

const test = setupTest();

describe('Respondent requests access to a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerSignsOut(test);

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

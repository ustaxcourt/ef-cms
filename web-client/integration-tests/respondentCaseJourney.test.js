import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { respondent1ViewsCaseDetailOfAssociatedCase } from './journey/respondent1ViewsCaseDetailOfAssociatedCase';
import { respondentFilesDocumentForAssociatedCase } from './journey/respondentFilesDocumentForAssociatedCase';
import { respondentFilesFirstIRSDocumentOnCase } from './journey/respondentFilesFirstIRSDocumentOnCase';
import { respondentRequestsAccessToCase } from './journey/respondentRequestsAccessToCase';
import { respondentSearchesForCase } from './journey/respondentSearchesForCase';
import { respondentSearchesForNonexistentCase } from './journey/respondentSearchesForNonexistentCase';
import { respondentViewsCaseDetail } from './journey/respondentViewsCaseDetail';
import { respondentViewsCaseDetailOfAssociatedCase } from './journey/respondentViewsCaseDetailOfAssociatedCase';
import { respondentViewsCaseDetailOfUnassociatedCase } from './journey/respondentViewsCaseDetailOfUnassociatedCase';
import { respondentViewsDashboard } from './journey/respondentViewsDashboard';

const test = setupTest();

describe('Respondent requests access to a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'irsPractitioner@example.com');
  respondentSearchesForNonexistentCase(test);
  respondentViewsDashboard(test);
  respondentSearchesForCase(test);
  respondentViewsCaseDetail(test);
  respondentFilesFirstIRSDocumentOnCase(test, fakeFile);
  respondentViewsDashboard(test);
  respondentViewsCaseDetailOfAssociatedCase(test);
  respondentFilesDocumentForAssociatedCase(test, fakeFile);

  loginAs(test, 'irsPractitioner1@example.com');
  respondentSearchesForCase(test);
  respondentViewsCaseDetailOfUnassociatedCase(test);
  respondentRequestsAccessToCase(test, fakeFile);
  respondent1ViewsCaseDetailOfAssociatedCase(test);
  respondentFilesDocumentForAssociatedCase(test, fakeFile);
});

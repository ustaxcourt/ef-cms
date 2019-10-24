import { fakeFile, setupTest } from './helpers';
import petitionerCancelsCreateCase from './journey/petitionerCancelsCreateCase';
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

const test = setupTest();

describe('petitioner files document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogin(test);
  petitionerCancelsCreateCase(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);
  petitionerFilesDocumentForCase(test, fakeFile);
  petitionerViewsCaseDetailAfterFilingDocument(test);
  petitionerSignsOut(test);
});

import { fakeFile, setupTest } from './helpers';
import chambersLogin from './journey/chambersLogin';
import chambersUserViewsDashboard from './journey/chambersUserViewsDashboard';

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

import petitionsClerkCreatesMessageToChambers from './journey/petitionsClerkCreatesMessageToChambers';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';

const test = setupTest();

describe('Chambers dashboard', () => {
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
  petitionsClerkCreatesMessageToChambers(test, 'Yeah, chambers!!');
  petitionsClerkSignsOut(test);

  chambersLogin(test);
  chambersUserViewsDashboard(test, 'Yeah, chambers!!');
});

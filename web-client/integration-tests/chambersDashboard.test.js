import { chambersUserViewsDashboard } from './journey/chambersUserViewsDashboard';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerAddNewCaseToTestObj } from './journey/petitionerAddNewCaseToTestObj';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsCaseDetailAfterFilingDocument } from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkCreatesMessageToChambers } from './journey/petitionsClerkCreatesMessageToChambers';

const test = setupTest();

describe('Chambers dashboard', () => {
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
  petitionsClerkCreatesMessageToChambers(
    test,
    'Yeah, chambers!!',
    createdCases,
  );

  loginAs(test, 'armensChambers@example.com');
  chambersUserViewsDashboard(test, 'Yeah, chambers!!');
});

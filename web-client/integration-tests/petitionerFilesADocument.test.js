import { fakeFile, setupTest } from './helpers';
import taxpayerCancelsCreateCase from './journey/taxpayerCancelsCreateCase';
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

describe('Taxpayer files document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogin(test);
  taxpayerCancelsCreateCase(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerViewsCaseDetail(test);
  taxpayerFilesDocumentForCase(test, fakeFile);
  taxpayerViewsCaseDetailAfterFilingDocument(test);
  taxpayerSignsOut(test);
});

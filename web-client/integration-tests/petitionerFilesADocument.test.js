import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerCancelsCreateCase } from './journey/petitionerCancelsCreateCase';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerFilesAmendedMotion } from './journey/petitionerFilesAmendedMotion';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsCaseDetailAfterFilingDocument } from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

const cerebralTest = setupTest();

describe('petitioner files document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerCancelsCreateCase(cerebralTest);
  petitionerChoosesProcedureType(cerebralTest);
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCase(cerebralTest, fakeFile);
  petitionerViewsDashboard(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(cerebralTest);
  petitionerFilesDocumentForCase(cerebralTest, fakeFile);
  petitionerViewsCaseDetailAfterFilingDocument(cerebralTest);
  petitionerFilesAmendedMotion(cerebralTest, fakeFile);
});

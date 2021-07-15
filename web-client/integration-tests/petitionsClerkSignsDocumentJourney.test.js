import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkAppliesSignatureToDraftDocument } from './journey/petitionsClerkAppliesSignatureToDraftDocument';
import { petitionsClerkClearsSignatureFromDraftDocument } from './journey/petitionsClerkClearsSignatureFromDraftDocument';
import { petitionsClerkNavigatesBackAfterViewSignDraftDocument } from './journey/petitionsClerkNavigatesBackAfterViewSignDraftDocument';
import { petitionsClerkRemovesSignatureFromDraftDocument } from './journey/petitionsClerkRemovesSignatureFromDraftDocument';
import { petitionsClerkSavesSignatureForDraftDocument } from './journey/petitionsClerkSavesSignatureForDraftDocument';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingOrder } from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { petitionsClerkViewsSignDraftDocument } from './journey/petitionsClerkViewsSignDraftDocument';

const cerebralTest = setupTest();

describe('Petitions Clerk Create Order Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(cerebralTest);
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCase(cerebralTest, fakeFile);
  petitionerViewsDashboard(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest);
  petitionsClerkAddsOrderToCase(cerebralTest);
  petitionsClerkViewsCaseDetailAfterAddingOrder(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest, 1);
  petitionsClerkViewsSignDraftDocument(cerebralTest);
  petitionsClerkAppliesSignatureToDraftDocument(cerebralTest);
  petitionsClerkClearsSignatureFromDraftDocument(cerebralTest);
  petitionsClerkAppliesSignatureToDraftDocument(cerebralTest);
  petitionsClerkSavesSignatureForDraftDocument(
    cerebralTest,
    'Order of Dismissal and Decision updated.',
  );
  petitionsClerkNavigatesBackAfterViewSignDraftDocument(cerebralTest);
  petitionsClerkRemovesSignatureFromDraftDocument(cerebralTest);
});

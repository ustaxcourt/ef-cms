import { loginAs, setupTest, uploadPetition } from './helpers';
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

describe('Petitions Clerk Create Order Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

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

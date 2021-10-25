import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserAppliesSignatureToDraftDocument } from './journey/chambersUserAppliesSignatureToDraftDocument';
import { chambersUserSavesSignatureForDraftDocument } from './journey/chambersUserSavesSignatureForDraftDocument';
import { chambersUserViewsCaseDetail } from './journey/chambersUserViewsCaseDetail';
import { chambersUserViewsCaseDetailAfterAddingOrder } from './journey/chambersUserViewsCaseDetailAfterAddingOrder';
import { chambersUserViewsDraftDocuments } from './journey/chambersUserViewsDraftDocuments';
import { chambersUserViewsSignDraftDocument } from './journey/chambersUserViewsSignDraftDocument';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'colvinsChambers@example.com');
  chambersUserViewsCaseDetail(cerebralTest, 2);
  chambersUserViewsDraftDocuments(cerebralTest);
  chambersUserAddsOrderToCase(cerebralTest);
  chambersUserViewsCaseDetailAfterAddingOrder(cerebralTest, 3);
  chambersUserViewsDraftDocuments(cerebralTest, 1);
  chambersUserViewsSignDraftDocument(cerebralTest);
  chambersUserAppliesSignatureToDraftDocument(cerebralTest, 'John O. Colvin');
  chambersUserSavesSignatureForDraftDocument(cerebralTest);
});

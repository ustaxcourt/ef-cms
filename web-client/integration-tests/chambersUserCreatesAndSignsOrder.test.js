import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserAppliesSignatureToDraftDocument } from './journey/chambersUserAppliesSignatureToDraftDocument';
import { chambersUserSavesSignatureForDraftDocument } from './journey/chambersUserSavesSignatureForDraftDocument';
import { chambersUserViewsCaseDetail } from './journey/chambersUserViewsCaseDetail';
import { chambersUserViewsCaseDetailAfterAddingOrder } from './journey/chambersUserViewsCaseDetailAfterAddingOrder';
import { chambersUserViewsDraftDocuments } from './journey/chambersUserViewsDraftDocuments';
import { chambersUserViewsSignDraftDocument } from './journey/chambersUserViewsSignDraftDocument';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

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
  petitionerChoosesProcedureType(cerebralTest);
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCase(cerebralTest, fakeFile);
  petitionerViewsDashboard(cerebralTest);

  loginAs(cerebralTest, 'colvinsChambers@example.com');
  chambersUserViewsCaseDetail(cerebralTest, 2);
  chambersUserViewsDraftDocuments(cerebralTest);
  chambersUserAddsOrderToCase(cerebralTest);
  chambersUserViewsCaseDetailAfterAddingOrder(cerebralTest, 3);
  chambersUserViewsDraftDocuments(cerebralTest, 1);
  chambersUserViewsSignDraftDocument(cerebralTest);
  chambersUserAppliesSignatureToDraftDocument(cerebralTest);
  chambersUserSavesSignatureForDraftDocument(cerebralTest);
});

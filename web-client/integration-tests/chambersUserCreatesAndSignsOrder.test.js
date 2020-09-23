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

const test = setupTest();
test.draftOrders = [];

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'armensChambers@example.com');
  chambersUserViewsCaseDetail(test, 3); // TODO 636 documents now includes RQT (request for place of trial as minute entry)
  chambersUserViewsDraftDocuments(test);
  chambersUserAddsOrderToCase(test);
  chambersUserViewsCaseDetailAfterAddingOrder(test, 4);
  chambersUserViewsDraftDocuments(test, 1);
  chambersUserViewsSignDraftDocument(test);
  chambersUserAppliesSignatureToDraftDocument(test);
  chambersUserSavesSignatureForDraftDocument(test);
});
